#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : website_size.py
# description       : Website custom size model
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20242409
# version           : 0.1
# notes             : This is a website size custom model
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _


class WebsiteCustomSize(models.Model):
    _name = 'website.size.custom'
    _description = 'Ecommerce website size custom'
    _rec_name = 'code'

    code = fields.Char(string='Banner Name', required=True) 
    category = fields.Selection([
        ('clothing', 'Clothing'),
        ('shoes', 'Shoes'),
        ('other', 'Other'),
    ], string='category', required=True, default='other')
    size_system = fields.Selection([
        ('eu', 'Europe'),
        ('uk', 'UK'),
        ('us', 'US'),
    ], string='category', required=True, default='eu')
    product_template_id = fields.Many2one('product.template', 'Product template')