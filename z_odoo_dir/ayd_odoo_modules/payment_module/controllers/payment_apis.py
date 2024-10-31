#!/usr/bin/env python
# -*- coding: utf-8 -*-
# filename          : payment_apis.py
# description       : Notch pay Payment APIS Controller
# author            : Steph Cyrille
# email             : stephcyril.sc@gmail.com
# date              : 20243009
# version           : 0.1
# notes             : This is a Payment API
# license           : MIT
# py version        : 3.9.6
# ==============================================================================

import json
import logging
import requests
from odoo import http, fields

_logger = logging.getLogger(__name__)


class PaymentNotchPayAPI(http.Controller):
    @http.route(['/apis/payment/init'], type='json', auth="public", methods=['POST'], website=True, csrf=False)
    def initialize_payment(self, **kwargs):
        apiKey = http.request.env['ir.config_parameter'].sudo().get_param('website.dev_api_key', default=None)
        json_data = json.loads(http.request.httprequest.data)

        amount = json_data.get('amount') if json_data.get('amount') else None
        description = json_data.get('description') if json_data.get('description') else None
        car_ref = json_data.get('reference') if json_data.get('reference') else None
        # Customer details
        customer_email = json_data.get('customer_email') if json_data.get('customer_email') else None
        customer_name = json_data.get('customer_name') if json_data.get('customer_name') else None
        customer_mobile = json_data.get('customer_mobile') if json_data.get('customer_mobile') else None
        customer_street = json_data.get('customer_street') if json_data.get('customer_street') else None
        customer_city = json_data.get('customer_city') if json_data.get('customer_city') else None
        # Check if the customer is already exist
        customer = http.request.env['res.partner'].sudo().search([('email', '=', customer_email)], limit=1)

        if not customer:
            customer = http.request.env['res.partner'].sudo().create({
                'name': customer_name,  # Provide a default name for the new customer
                'email': customer_email,
                'mobile': customer_mobile,
                'street': customer_street,
                'city': customer_city,
            })

        if apiKey is not None:
            url = "https://api.notchpay.co/payments"

            payload = json.dumps({
                "amount": int(amount),
                "currency": "XAF",
                "description": description,
                "reference": car_ref,
                "customer": {
                    "email": customer.email,
                    "name": customer.name,
                    "phone": customer.mobile,
                    "address": customer.street,
                    "city": customer.city
                }
            })

            headers = {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            }

            try:
                response = requests.request("POST", url, headers=headers, data=payload)
                response_data = response.json()
                # Check if the response status is success
                if response.status_code == 201 and response_data.get('status') == 'Accepted':
                    transaction_data = response_data.get('transaction', {})
                    
                    # Prepare data to save in Odoo
                    vals = {
                        'amount': transaction_data.get('amount', 0.0),
                        'amount_total': transaction_data.get('amount_total', 0.0),
                        'sandbox': transaction_data.get('sandbox', False),
                        'fee': transaction_data.get('fee', 0.0),
                        'converted_amount': transaction_data.get('converted_amount', 0.0),
                        'customer_id': customer.id,
                        'description': f"{transaction_data.get('description', '')}\n{transaction_data.get('merchant_reference', '')}\n{transaction_data.get('trxref', '')}",
                        'reference': transaction_data.get('reference', ''),
                        'status': transaction_data.get('status', 'pending'),
                        'currency': transaction_data.get('currency', ''),
                        'geo': transaction_data.get('geo', '')
                    }

                    so_id = transaction_data.get('reference', '')
                    if so_id:
                        vals['sale_order_id'] = int(so_id.split('#')[-1])

                    # Create a new record in the payment.notch.request model
                    http.request.env['payment.notch.request'].sudo().create(vals)

                    res = {
                        "code": response.status_code,
                        "data": vals
                    }
                    return res
                else:
                    res = {
                        "code": 400,
                        "errorMessage": f"Payment server side error",
                        "message": response_data.get('message', 'Unknown error')
                    }
                    return res

            except Exception as e:
                res = {
                    "code": 406,
                    "errorMessage": f"Failed to initialize payment",
                    "message": e.__str__()
                }
                return res
        else:
            res = {
                "code": 401,
                "errorMessage": "Please fill the API Key",
                "message": "Please fill the API Key",
            }
            return res
        
    @http.route(['/apis/payment/proceed'], type='json', auth="public", methods=['POST'], website=True, csrf=False)
    def procceed_payment(self, **kwargs):
        apiKey = http.request.env['ir.config_parameter'].sudo().get_param('website.dev_api_key', default=None)
        json_data = json.loads(http.request.httprequest.data)

        reference = json_data.get('reference') if json_data.get('reference') else None
        channel = json_data.get('channel') if json_data.get('channel') else None
        phone = json_data.get('phone') if json_data.get('phone') else None

        url = f"https://api.notchpay.co/payments/{reference}"

        payload = json.dumps({
            "channel": channel,
            "data": {
                'phone': phone
            }
        })

        headers = {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        }

        try:
            response = requests.request("PUT", url, headers=headers, data=payload)
            response_data = response.json()
            if response.status_code == 202 and response_data.get('status') == 'Accepted':
                payment_transaction = http.request.env['payment.notch.request'].sudo().search([('reference', '=', reference)], limit=1)
                if payment_transaction:
                    vals = {
                        'amount': payment_transaction.amount,
                        'amount_total': payment_transaction.amount_total,
                        'fee': payment_transaction.fee,
                        'converted_amount': payment_transaction.converted_amount,
                        'customer_id': payment_transaction.customer_id.id,
                        'reference': payment_transaction.reference,
                        'description': payment_transaction.description,
                        'status': 'completed',
                        'currency': payment_transaction.currency,
                        'geo': payment_transaction.geo
                    }
                    
                    if payment_transaction.sale_order_id:
                        payment_transaction.sale_order_id.action_confirm()

                    for rec in payment_transaction:
                        rec.write({
                            'status': 'complete'
                        })

                    res = {
                        "code": response.status_code,
                        "data": vals
                    }
                    return res
                else:
                    res = {
                        "code": 404,
                        "errorMessage": f"Payment confirmation server side error",
                        "message": f"Payment transaction reference {reference} not found"
                    }
                    return res
            else:
                res = {
                    "code": 400,
                    "errorMessage": f"Payment confirmation server side error",
                    "message": response_data.get('message', 'Unknown error')
                }
                return res
        except Exception as e:
            pass