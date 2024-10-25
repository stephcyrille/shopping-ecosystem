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
