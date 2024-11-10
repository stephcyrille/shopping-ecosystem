#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : sale_order_line.py
# description       : Sale order line model inherited
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20241110
# version           : 0.1
# notes             : This is a sale order line inherited for adding size
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import fields, models, _


class SaleOrderWebAPI(models.Model):
    _inherit = 'sale.order.line'

    size = fields.Char('size', required=False)
