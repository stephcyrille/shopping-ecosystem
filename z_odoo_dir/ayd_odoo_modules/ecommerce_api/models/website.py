#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : website.py
# description       : website model inherited
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20241025
# version           : 0.1
# notes             : This is a website inherited
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import SUPERUSER_ID, api, fields, models, _


class WebsiteWebAPI(models.Model):
    _inherit = 'website'

    def custom_sale_get_order(self, force_create=False, session_cart_id=False):
        """ Return the current sales order after mofications specified by params.

        :param bool force_create: Create sales order if not already existing

        :returns: current cart, as a sudoed `sale.order` recordset (might be empty)
        """
        self.ensure_one()

        self = self.with_company(self.company_id)
        SaleOrder = self.env['sale.order'].sudo()

        # Search so by cart ref
        if session_cart_id:
            sale_order_id = SaleOrder.search([('scma_dj_ref', '=', session_cart_id)], limit=1).id

            if sale_order_id:
                sale_order_sudo = SaleOrder.browse(sale_order_id).exists()
            else:
                sale_order_sudo = SaleOrder

            # Ignore the current order if a payment has been initiated. We don't want to retrieve the
            # cart and allow the user to update it when the payment is about to confirm it.
            if sale_order_sudo and sale_order_sudo.get_portal_last_transaction().state in (
                'pending', 'authorized', 'done'
            ):
                sale_order_sudo = None
            
            public_user = self.env.ref('base.public_user')
            partner_sudo = public_user.sudo().partner_id

            # cart creation was requested
            if not sale_order_sudo:
                so_data = self._prepare_sale_order_values(partner_sudo)
                so_data['scma_dj_ref'] = session_cart_id
                sale_order_sudo = SaleOrder.with_user(SUPERUSER_ID).create(so_data)
                # The order was created with SUPERUSER_ID, revert back to request user.
                return sale_order_sudo.with_user(self.env.user).sudo()

            # check for change of partner_id ie after signup
            if partner_sudo.id not in (sale_order_sudo.partner_id.id, self.partner_id.id):
                sale_order_sudo._update_address(partner_sudo.id, ['partner_id'])

            return sale_order_sudo
        else:
            return None
