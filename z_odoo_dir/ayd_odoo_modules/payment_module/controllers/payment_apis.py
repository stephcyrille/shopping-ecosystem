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
    @http.route(['/apis/payment/init'], type='http', auth='public', methods=["GET"], website=True)
    def initialize_payment(self, **params):
        apiKey = http.request.env['ir.config_parameter'].sudo().get_param('website.dev_api_key', default=None)

        if apiKey is not None:
            url = "https://api.notchpay.co/payments"

            payload = json.dumps({
                "amount": 500,
                "currency": "XAF",
                "description": "My first payment",
                "reference": "IB01X900345beto",
                "customer": {
                    "email": "customer@email.com"
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

                    customer_email = "customer@email.com"  # Can be dynamic based on request data
                    customer = http.request.env['res.partner'].sudo().search([('email', '=', customer_email)], limit=1)

                    if not customer:
                        customer = http.request.env['res.partner'].sudo().create({
                            'name': 'New Customer',  # Provide a default name for the new customer
                            'email': customer_email,
                        })
                    
                    # Prepare data to save in Odoo
                    vals = {
                        'amount': transaction_data.get('amount', 0.0),
                        'amount_total': transaction_data.get('amount_total', 0.0),
                        'sandbox': transaction_data.get('sandbox', False),
                        'fee': transaction_data.get('fee', 0.0),
                        'converted_amount': transaction_data.get('converted_amount', 0.0),
                        'customer_id': customer.id,
                        'description': transaction_data.get('description', ''),
                        'reference': transaction_data.get('reference', ''),
                        'status': transaction_data.get('status', 'pending'),
                        'currency': transaction_data.get('currency', ''),
                        'geo': transaction_data.get('geo', '')
                    }

                    # Create a new record in the payment.notch.request model
                    http.request.env['payment.notch.request'].sudo().create(vals)

                    res = {
                        "code": response.status_code,
                        "result": vals
                    }
                    return http.Response(
                        json.dumps(res),
                        status=200,
                        mimetype='application/json'
                    )
                else:
                    res = {
                        "code": 400,
                        "errorMessage": f"Serveur side error {response_data.get('message', 'Unknown error')}"
                    }
                    return http.Response(
                        json.dumps(res),
                        status=200,
                        mimetype='application/json'
                    )

            except Exception as e:
                res = {
                    "code": 406,
                    "errorMessage": f"Failed to initialize payment {e.__str__()}"
                }
                return http.Response(
                    json.dumps(res),
                    status=200,
                    mimetype='application/json'
                )
        else:
            res = {
                "code": 401,
                "errorMessage": "Please fill the API Key"
            }
            return http.Response(
                json.dumps(res),
                status=200,
                mimetype='application/json'
            )