#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : product_template.py
# description       : Product template model inherited
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240808
# version           : 0.1
# notes             : This is a product template inherited
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _


class ProductTemplateWebAPI(models.Model):
    _inherit = 'product.template'

    api_product_description = fields.Text('Product Description')
    dimensions_value = fields.Char('Dimensions')
    dimensions_unity = fields.Char('Dim unity')
