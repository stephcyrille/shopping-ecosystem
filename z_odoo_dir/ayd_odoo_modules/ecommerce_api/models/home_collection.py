#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : site_banner.py
# description       : Ecommerce home collection card with Url and title 
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20240911
# version           : 0.1
# notes             : This is the home collection object
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _


class HomeCollection(models.Model):
    _name = 'website.home.collection'
    _description = 'Ecommerce home collection'
    _rec_name = 'title'

    title = fields.Char(string='Title', required=True) 
    label = fields.Char(string='Label') 
    url_label = fields.Char(string='URL label') 
    link = fields.Char(string='URL') 
    picture = fields.Image("Image")
