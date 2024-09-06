#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : cart_apis.py
# description       : Cart API controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240808
# version           : 0.1
# notes             : This is a cart API controller
# license           : MIT
# py version        : 3.9.6
# ==============================================================================
import hashlib
import json
import logging
from odoo import http, fields
from odoo.tools.json import scriptsafe as json_scriptsafe
from odoo.addons.payment import utils as payment_utils

from ..utils.image_lib import get_image_url

_logger = logging.getLogger(__name__)


class EcommerceAPI(http.Controller):
    @http.route(['/apis/cart/list'], type='http', auth='public', methods=["GET"], website=True)
    def get_shopping_cart(self, access_token=None, revive='', **post):
        """
           Main cart management + abandoned cart revival
           access_token: Abandoned cart SO access token
           revive: Revival method when abandoned cart. Can be 'merge' or 'squash'
       """
        order = http.request.website.sale_get_order()
        if order and order.state != 'draft':
            http.request.session['sale_order_id'] = None
            order = http.request.website.sale_get_order()

        http.request.session['website_sale_cart_quantity'] = order.cart_quantity

        values = {}
        res = {}
        if access_token:
            abandoned_order = http.request.env['sale.order'].sudo().search([('access_token', '=', access_token)],
                                                                           limit=1)
            if not abandoned_order:  # wrong token (or SO has been deleted)
                res["error"]["code"] = 200
                res["error"]["message"] = "The sale order could not be found."
                res["error"]["context"] = ""
                return http.Response(
                    json.dumps(res),
                    status=200,
                    mimetype='application/json'
                )
            if abandoned_order.state != 'draft':  # abandoned cart already finished
                values.update({'abandoned_proceed': True})
            elif revive == 'squash' or (revive == 'merge' and not http.request.session.get(
                'sale_order_id')):  # restore old cart or merge with unexistant
                http.request.session['sale_order_id'] = abandoned_order.id
                res["result"] = []
                return http.Response(
                    json.dumps(res),
                    status=200,
                    mimetype='application/json'
                )
            elif revive == 'merge':
                abandoned_order.order_line.write({'order_id': http.request.session['sale_order_id']})
                abandoned_order.action_cancel()
            elif abandoned_order.id != http.request.session.get(
                'sale_order_id'):  # abandoned cart found, user have to choose what to do
                values.update({'access_token': abandoned_order.access_token})

        values.update({
            'website_sale_order': order,
            'date': fields.Date.today(),
            'suggested_products': [],
        })
        if order:
            values.update(order._get_website_sale_extra_values())
            order.order_line.filtered(lambda l: l.product_id and not l.product_id.active).unlink()
            values['suggested_products'] = order._cart_accessories()
            # values.update(self._get_express_shop_payment_values(order))
            # Serialize sale.order
            sale_order_dict = {
                'id': order.id,
                'name': order.name,
                'partner_id': order.partner_id.id,
                'partner_name': order.partner_id.name,
                'date_order': order.date_order,
                'state': order.state,
                'amount_total': order.amount_total,
                'order_line': [{
                    'product_id': line.product_id.id,
                    'product_name': f"{line.product_id.name} {[attrs.name for attrs in line.product_id.product_template_attribute_value_ids][0]}",
                    'product_uom_qty': line.product_uom_qty,
                    'price_unit': line.price_unit,
                    'price_subtotal': line.price_subtotal,
                    'image': {
                        'id': 0,
                        'image_url': f"{line.product_id.product_tmpl_id.get_base_url()}{get_image_url(line.product_id, 'image_1920')}",
                        'video_url': ''
                    }
                } for line in order.order_line]
            }
            values["website_sale_order"] = sale_order_dict

        res["result"] = values
        return http.Response(
            json.dumps(res, default=str),
            status=200,
            mimetype='application/json'
        )

    @http.route(['/apis/cart/update'], type='json', auth="public", methods=['POST'], website=True, csrf=False)
    def update_cart(self, **kwargs):
        # Retrieve the cart sale_order_id from request
        """This route is called when adding a product to cart (no options)."""
        """
        This route is called :
            - When changing quantity from the cart.
            - When adding a product from the wishlist.
            - When adding a product to cart on the same page (without redirection).
        """

        product_custom_attribute_values = kwargs.get('product_custom_attribute_values')
        no_variant_attribute_values = kwargs.get('no_variant_attribute_values')
        product_id = kwargs.get('product_id')
        set_qty = kwargs.get('set_qty') if kwargs.get('set_qty') else None
        add_qty = kwargs.get('add_qty') if kwargs.get('add_qty') else None
        line_id = kwargs.get('line_id') if kwargs.get('line_id') else None
        update_methode = kwargs.get('update_methode') if kwargs.get('update_methode') else None

        order = http.request.website.sale_get_order(force_create=True)
        if order.state != 'draft':
            http.request.website.sale_reset()
            if kwargs.get('force_create'):
                order = http.request.website.sale_get_order(force_create=True)
            else:
                return {}

        if product_custom_attribute_values:
            product_custom_attribute_values = json_scriptsafe.loads(product_custom_attribute_values)

        if no_variant_attribute_values:
            no_variant_attribute_values = json_scriptsafe.loads(no_variant_attribute_values)

        if update_methode is None:
            values = order._cart_update(
                product_id=int(product_id),
                line_id=line_id,
                add_qty=add_qty,
                set_qty=set_qty,
                product_custom_attribute_values=product_custom_attribute_values,
                no_variant_attribute_values=no_variant_attribute_values,
            )
        else:
            values = order._cart_update(
                product_id=int(product_id),
                line_id=line_id,
                set_qty=set_qty,
            )

        http.request.session['website_sale_cart_quantity'] = order.cart_quantity

        if not order.cart_quantity:
            http.request.website.sale_reset()
            return values

        values['cart_quantity'] = order.cart_quantity
        values['minor_amount'] = payment_utils.to_minor_currency_units(
            order.amount_total, order.currency_id
        ),
        values['amount'] = order.amount_total

        display = True
        if not display:
            return values

        values['website_sale.cart_lines'] = http.request.env['ir.ui.view']._render_template(
            "website_sale.cart_lines", {
                'website_sale_order': order,
                'date': fields.Date.today(),
                'suggested_products': order._cart_accessories()
            }
        )
        values['website_sale.short_cart_summary'] = http.request.env['ir.ui.view']._render_template(
            "website_sale.short_cart_summary", {
                'website_sale_order': order,
            }
        )
        return values
