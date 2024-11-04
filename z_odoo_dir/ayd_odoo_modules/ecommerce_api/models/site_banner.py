#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : site_banner.py
# description       : Ecommerce website banner 
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240808
# version           : 0.1
# notes             : This is the banner reussable object
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _


class SiteBanner(models.Model):
    _name = 'website.site.banner'
    _description = 'Ecommerce banner component'

    name = fields.Char(string='Banner Name', required=True) 
    description = fields.Text(string='Description') 
    picture = fields.Image("Banner Image")
    page = fields.Selection([
        ('home', 'Home Page'),
        ('product', 'Product Page'),
        ('category', 'Category Page'),
        ('contact', 'Contact Page'),
        ('about', 'About Page'),
        ('custom', 'Custom Page')
    ], string='Page', required=True, default='home')

