#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : res_partner.py
# description       : Partner model inherited
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20241116
# version           : 0.1
# notes             : This is a res partner inherited for adding size
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import fields, models, _


class ResPartnerWebAPI(models.Model):
    _inherit = 'res.partner'

    firstname = fields.Char('First name', required=False)
    lastname = fields.Char('Last name', required=False)
