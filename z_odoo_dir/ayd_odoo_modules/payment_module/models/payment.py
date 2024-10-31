#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : payment.py
# description       : Payment module that hold all payment objects
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20242909
# version           : 0.1
# notes             : This is a module that's hold all payments objects from payment vendor app
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

from odoo import api, fields, models, _
from datetime import datetime


class PaymentTransaction(models.Model):
    _name = 'payment.notch.request'
    _description = 'NotchPay Payment request'
    _rec_name = 'reference'

    amount = fields.Float(string="Amount")
    amount_total = fields.Float(string="Amount Total")
    sandbox = fields.Boolean(string="Sandbox", default=False)
    fee = fields.Float(string="Fee")
    converted_amount = fields.Float(string="Converted Amount")
    customer_id = fields.Many2one('res.partner', 'Customer')
    sale_order_id = fields.Many2one('sale.order', 'Sale order')
    description = fields.Text(string="Description")
    reference = fields.Char(string="Transaction Reference")
    currency = fields.Char(string="Currency")
    geo = fields.Char(string="Geo IP")
    created_at = fields.Datetime(string="Created At")
    updated_at = fields.Datetime(string="Updated At", default=fields.Datetime.now)
    status = fields.Selection([
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('incomplete', 'Incomplete'),
        ('canceled', 'Canceled'),
        ('failed', 'Failed'),
        ('rejected', 'Rejected'),
        ('abandoned', 'Abandonned'),
        ('expired', 'Expired'),
        ('complete', 'Completed'),
        ('refunded', 'Refunded'),
        ('partialy-refunded', 'Partially refunded'),
    ], string='category', required=True, default='other')
    
    @api.model
    def create(self, vals):
        vals['created_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return super(PaymentTransaction, self).create(vals)
    
    def write(self, vals):
        vals['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return super(PaymentTransaction, self).write(vals)

