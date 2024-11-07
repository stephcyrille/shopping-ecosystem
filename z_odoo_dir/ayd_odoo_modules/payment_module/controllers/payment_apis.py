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

import hashlib
import hmac
import json
import logging
import requests
import uuid
from odoo import http
_logger = logging.getLogger(__name__)

API_IS_LIVE = False

def generate_unique_code():
    # Generate a random UUID (Universally Unique Identifier)
    unique_id = uuid.uuid4()    
    # Create a SHA-1 hash of the UUID
    hash_object = hashlib.sha1(str(unique_id).encode())
    # Convert the hash to a hexadecimal string
    unique_code = hash_object.hexdigest()
    return unique_code


def get_image_url(record, field, size=None):
    """ Returns a local url that points to the image field of a given browse record. """
    sudo_record = record.sudo()
    sha = hashlib.sha512(str(getattr(sudo_record, '__last_update')).encode('utf-8')).hexdigest()[:7]
    size = '' if size is None else '/%s' % size
    return '/web/image/%s/%s/%s%s?unique=%s' % (record._name, record.id, field, size, sha)


class PaymentNotchPayAPI(http.Controller):
    @http.route(['/apis/payment/init'], type='json', auth="user", methods=['POST'], website=True, csrf=False)
    def initialize_payment(self, **kwargs):
        is_live = http.request.env['ir.config_parameter'].sudo().get_param('website.is_live', default=None)
        apiKey = http.request.env['ir.config_parameter'].sudo().get_param(
            'website.prod_api_key' if is_live else 'website.dev_api_key', default=None)
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
        delivery_fee = json_data.get('delivery_fee') if json_data.get('delivery_fee') else None
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
                "reference": generate_unique_code(),
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
                        'description': f"{transaction_data.get('description', '')}\nInternal Cart reference {car_ref}\nNotch pay Reference {transaction_data.get('trxref', '')}",
                        'reference': transaction_data.get('reference', ''),
                        'status': transaction_data.get('status', 'pending'),
                        'currency': transaction_data.get('currency', ''),
                        'geo': transaction_data.get('geo', ''),
                        'delivery_fee': delivery_fee,
                    }

                    so_id = car_ref
                    if so_id:
                        vals['sale_order_id'] = int(so_id.split('#')[-1])

                        # Create a new record in the payment.notch.request model
                        payment_req = http.request.env['payment.notch.request'].sudo().create(vals)
                        # Add a right partner for the SO
                        payment_req.sale_order_id.write({
                            'partner_id': customer.id
                        })
                    else:
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
        
    @http.route(['/apis/payment/proceed'], type='json', auth="user", methods=['POST'], website=True, csrf=False)
    def procceed_payment(self, **kwargs):
        is_live = http.request.env['ir.config_parameter'].sudo().get_param('website.is_live', default=None)
        apiKey = http.request.env['ir.config_parameter'].sudo().get_param(
            'website.prod_api_key' if is_live else 'website.dev_api_key', default=None)
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

        payment_method = ''
        if 'cm.orange' == channel:
            payment_method = 'Orange Money'
        elif 'cm.mtn' == channel:
            payment_method = 'MTN Mobile Money'
        else:
            payment_method = 'Other'

        try:
            response = requests.request("PUT", url, headers=headers, data=payload)
            response_data = response.json()
            if response.status_code == 202 and response_data.get('status') == 'Accepted':
                transaction_data = response_data.get('transaction', {})
                message_confirm = response_data.get('message', '')

                if transaction_data and transaction_data.get('sandbox') == False:
                    payment_transaction = http.request.env['payment.notch.request'].sudo().search([('reference', '=', reference)], limit=1)
                    if payment_transaction:
                        if payment_transaction.sale_order_id:
                            payment_transaction.sale_order_id.action_confirm()

                        for rec in payment_transaction:
                            rec.write({
                                'status': transaction_data.get('status', ''),
                                'payment_method': payment_method
                            })
                        res = {
                            "code": 202,
                            "action": "confirm",
                            "message": message_confirm,
                            "reference": payment_transaction.reference,
                            "weather": 1
                        }
                        return res
                    else:
                        res = {
                            "code": 404,
                            "errorMessage": f"Payment processing USSD server side error",
                            "message": f"Payment transaction reference {reference} not found"
                        }
                        return res
                else:
                    payment_transaction = http.request.env['payment.notch.request'].sudo().search([('reference', '=', reference)], limit=1)
                    if payment_transaction:
                        if payment_transaction.sale_order_id:
                            payment_transaction.sale_order_id.action_confirm()

                        order = payment_transaction.sale_order_id
                        sale_order_dict = {
                            'id': order.id,
                            'name': order.name,
                            'partner_id': order.partner_id.id,
                            'partner_name': order.partner_id.name,
                            'date_order': order.date_order,
                            'state': order.state,
                            'amount_total': order.amount_total,
                            'order_line': [{
                                'line_id': line.id,
                                'product_id': line.product_id.id,
                                'product_name': f"{line.product_id.name}", 
                                'product_uom_qty': line.product_uom_qty,
                                'price_unit': line.price_unit,
                                'price_subtotal': line.price_subtotal,
                                'image': {
                                    'id': 0,
                                    'image_url': f"{line.product_id.product_tmpl_id.get_base_url()}{get_image_url(line.product_id, 'image_1920')}",
                                    'video_url': ''
                                }
                            } for line in order.order_line]
                        }
                        vals = {
                            'amount': payment_transaction.amount,
                            'amount_total': payment_transaction.amount_total,
                            'fee': payment_transaction.fee,
                            'converted_amount': payment_transaction.converted_amount,
                            'customer_id': payment_transaction.customer_id.id,
                            'reference': payment_transaction.reference,
                            'description': payment_transaction.description,
                            'currency': payment_transaction.currency,
                            'geo': payment_transaction.geo,
                            'delivery_fee': payment_transaction.delivery_fee,
                            'website_sale_order': sale_order_dict,
                            'payment_method': payment_method,
                        }
                        
                        for rec in payment_transaction:
                            rec.write({
                                'payment_method': payment_method
                            })

                        res = {
                            "code": response.status_code,
                            "data": vals,
                            "weather": 0
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
            res = {
                "code": 500,
                "errorMessage": "Exception triggered on update put payment call",
                "message": e.__str__()
            }
            return res
    
    @http.route(['/apis/payment/conf'], type='http', auth="user", methods=['GET'], website=True, csrf=False)
    def send_hash(self, **kwargs):
        is_live = http.request.env['ir.config_parameter'].sudo().get_param('website.is_live', default=None)
        apiSecret = http.request.env['ir.config_parameter'].sudo().get_param(
            'website.prod_secret_key' if is_live else 'website.dev_secret_key', default=None)
        
        res = {
            "code": 200,
            "result": apiSecret
        }
        return http.Response(
            json.dumps(res, default=str),
            status=200,
            mimetype='application/json'
        )
    
    @http.route(['/apis/payment/confirm'], type='json', auth="user", methods=['POST'], website=True, csrf=False)
    def confirm_payment(self, **kwargs):
        json_data = json.loads(http.request.httprequest.data)

        event = json_data.get('event', '')
        data = json_data.get('data', '')
        reference = data.get('reference', '')

        if reference:
            payment_transaction = http.request.env['payment.notch.request'].sudo().search([('reference', '=', reference)], limit=1)
            if payment_transaction:
                status = data.get('status', '')
                fee = data.get('fee', '')

                try:
                    details = f"{payment_transaction.description}\n{event}"
                    for rec in payment_transaction:
                        rec.write({
                            'status': status,
                            'fee': fee,
                            'description': details,
                        })
                    
                    res = {
                        "code": 200,
                        "message": f"Transaction {event} success",
                        "messageBody": "Transaction completed clearly"
                    }
                    return res
                
                except Exception as e:
                    res = {
                        "code": 500,
                        "message": f"Transaction {event} update error",
                        "messageBody": e.__str__()
                    }
                    return res
            else:
                res = {
                    "code": 404,
                    "message": f"Transaction {event} error",
                    "messageBody": "Unable to find the transaction payment object"
                }
                return res
        else:
            res = {
                "code": 404,
                "message": f"Transaction {event} error",
                "messageBody": f"No reference matching for {reference}"
            }
            return res
        
    
    @http.route(['/apis/payment/check'], type='http', auth="public", methods=['GET'], website=True, csrf=False)
    def check_payment(self, **kwargs):
        is_live = http.request.env['ir.config_parameter'].sudo().get_param('website.is_live', default=None)
        apiKey = http.request.env['ir.config_parameter'].sudo().get_param(
            'website.prod_api_key' if is_live else 'website.dev_api_key', default=None)
        reference = kwargs.get('reference', None)
        
        if apiKey is not None:
            url = f"https://api.notchpay.co/payments/{reference}"

            headers = {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            }

            if reference is None:
                res = {
                    "code": 401,
                    "error": f"No transaction found",
                    "message": f"Check paiement transaction {reference} error",
                }
                return http.Response(
                    json.dumps(res, default=str),
                    status=200,
                    mimetype='application/json'
                )

            try:
                response = requests.request("GET", url, headers=headers)
                response_data = response.json()
                if response.status_code == 200 and response_data.get('status') == 'OK':
                    transaction_data = response_data.get('transaction', {})
                    if transaction_data.get('status') and transaction_data.get('status') == 'complete':
                        payment_transaction = http.request.env['payment.notch.request'].sudo().search([('reference', '=', reference)], limit=1)
                        if payment_transaction:
                            order = payment_transaction.sale_order_id
                            sale_order_dict = {
                                'id': order.id,
                                'name': order.name,
                                'partner_id': order.partner_id.id,
                                'partner_name': order.partner_id.name,
                                'date_order': order.date_order,
                                'state': order.state,
                                'amount_total': order.amount_total,
                                'order_line': [{
                                    'line_id': line.id,
                                    'product_id': line.product_id.id,
                                    'product_name': f"{line.product_id.name}", 
                                    'product_uom_qty': line.product_uom_qty,
                                    'price_unit': line.price_unit,
                                    'price_subtotal': line.price_subtotal,
                                    'image': {
                                        'id': 0,
                                        'image_url': f"{line.product_id.product_tmpl_id.get_base_url()}{get_image_url(line.product_id, 'image_1920')}",
                                        'video_url': ''
                                    }
                                } for line in order.order_line]
                            }
                            vals = {
                                'status': transaction_data.get('status'),
                                'amount': payment_transaction.amount,
                                'amount_total': payment_transaction.amount_total,
                                'fee': payment_transaction.fee,
                                'converted_amount': payment_transaction.converted_amount,
                                'customer_id': payment_transaction.customer_id.id,
                                'reference': payment_transaction.reference,
                                'description': payment_transaction.description,
                                'currency': payment_transaction.currency,
                                'geo': payment_transaction.geo,
                                'delivery_fee': payment_transaction.delivery_fee,
                                'website_sale_order': sale_order_dict,
                                'payment_method': payment_transaction.payment_method,
                            }

                            res = {
                                "code": response.status_code,
                                "data": vals,
                            }
                            return http.Response(
                                json.dumps(res, default=str),
                                status=200,
                                mimetype='application/json'
                            )  
                        else:
                            res = {
                                "code": 404,
                                "errorMessage": f"Payment confirmation server side error",
                                "message": f"Payment transaction reference {reference} not found"
                            }
                            return http.Response(
                                json.dumps(res, default=str),
                                status=200,
                                mimetype='application/json'
                            )                            
                    else:
                        res = {
                            "code": 200,
                            "data": {
                                'status': transaction_data.get('status')
                            }
                        }
                        return http.Response(
                            json.dumps(res, default=str),
                            status=200,
                            mimetype='application/json'
                        )
                else:
                    res = {
                        "code": response.status_code,
                        "errorMessage": f"Payment GET confirmation server side error",
                        "message": response_data.get('message', 'Unknown error')
                    }
                    return http.Response(
                        json.dumps(res, default=str),
                        status=200,
                        mimetype='application/json'
                    )

            except Exception as e:
                res = {
                    "code": 500,
                    "errorMessage": "Exception checking payment call",
                    "message": e.__str__()
                }
                return http.Response(
                    json.dumps(res, default=str),
                    status=200,
                    mimetype='application/json'
                )

        else:
            res = {
                "code": 401,
                "errorMessage": "Please fill the API Key",
                "message": "Please fill the API Key",
            }
            return res