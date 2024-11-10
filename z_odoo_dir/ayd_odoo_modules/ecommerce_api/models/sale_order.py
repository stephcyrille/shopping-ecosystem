#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : sale_order.py
# description       : Sale order model inherited
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20241024
# version           : 0.1
# notes             : This is a sale order inherited
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _


class SaleOrderWebAPI(models.Model):
    _inherit = 'sale.order'

    scma_dj_ref = fields.Char('Django session ref', required=False)

    def _cart_update(self, product_id=None, line_id=None, add_qty=0, set_qty=0, size=None, **kwargs):
        # Call the original _cart_update to maintain the existing functionality
        result = super(SaleOrderWebAPI, self)._cart_update(
            product_id=product_id,
            line_id=line_id,
            add_qty=add_qty,
            set_qty=set_qty,
            **kwargs
        )

        # Check if a line_id is present, otherwise get it from the result
        sale_order_line = self.env['sale.order.line'].browse(line_id or result.get('line_id'))

        # If a `size` parameter was provided, update the sale order line with it
        if sale_order_line and size:
            sale_order_line.size = size

        return result
