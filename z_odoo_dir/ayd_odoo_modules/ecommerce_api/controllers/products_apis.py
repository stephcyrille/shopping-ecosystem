#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : products_apis.py
# description       : Product API controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240808
# version           : 0.1
# notes             : This is a product API controller
# license           : MIT
# py version        : 3.9.6
# ==============================================================================
import json
import logging
from odoo import http
from ..utils.api_auth_lib import check_auth
from ..utils.serializer import deserialize_product


_logger = logging.getLogger(__name__)


class EcommerceAPI(http.Controller):
    @http.route(['/apis/products'], type='http', auth='public', methods=["GET"], website=True)
    def get_products_list(self, **params):
        products_list = http.request.env['product.template'].sudo().search([])

        products = []
        for product in products_list:
            if product.is_published:
                val = deserialize_product(product)
                products.append(val)

        print('\n\n')
        print(f"IP: {http.request.httprequest.remote_addr}")
        print(check_auth(http.request.session.uid, http.request.env['res.users']))
        print(http.request.session.get('sale_order_id'))
        print(f"{http.request.env['ir.config_parameter'].sudo().get_param('website.dev_api_key', default='')}")
        print('\n\n')

        curr_page = 1
        total_pages = len(products)
        page_size = len(products)
        res = {
            "count": page_size,
            # "prev": 0,
            "current": curr_page,
            # "next": 2,
            "total_pages": total_pages,
            "result": products,
            "key_API": http.request.env['ir.config_parameter'].sudo().get_param('website.dev_api_key', default='')
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )

    def _prepare_product_values(self, product, category, search, **kwargs):
        product_categories = product.public_categ_ids

        if category:
            category = product_categories.browse(int(category)).exists()

        attrib_list = http.request.httprequest.args.getlist('attrib')
        attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
        attrib_set = {v[1] for v in attrib_values}

        # Needed to trigger the recently viewed product rpc
        view_track = http.request.website.viewref("website_sale.product").track

        categories_serialized = []
        for cat in product_categories:
            category_data = {
                'id': cat.id,
                'name': cat.name
            }
            categories_serialized.append(category_data)

        return {
            'search': search,
            'category': category,
            'attrib_values': attrib_values,
            'attrib_set': attrib_set,
            'categories': categories_serialized,
            'product': deserialize_product(product),
            'add_qty': 1,
            'view_track': view_track,
        }

    @http.route(['/apis/products/single/<model("product.template"):product>'],
                type='http', auth="public", website=True, sitemap=True,
                methods=["GET"])
    def get_single_product(self, **kwargs):
        category = ''
        search = ''
        product_value = self._prepare_product_values(category=category, search=search, **kwargs)

        print("\n\n")
        print(http.request.env.cr.dbname)
        print("\n\n")

        res = {"result": product_value}
        return http.Response(
            json.dumps(res, default=str),
            status=200,
            mimetype='application/json'
        )

    @http.route(['/apis/categories'], type='http', auth='public', methods=["GET"], website=True)
    def get_categories_list(self, **params):
        categories_list = http.request.env['product.public.category'].sudo().search([])

        categories = []
        for category in categories_list:
            val = {
                'id': category.id,
                'name': category.name,
            }
            categories.append(val)

        curr_page = 1
        total_pages = len(categories)
        page_size = len(categories)
        res = {
            "count": page_size,
            # "prev": 0,
            "current": curr_page,
            # "next": 2,
            "total_pages": total_pages,
            "result": categories
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )