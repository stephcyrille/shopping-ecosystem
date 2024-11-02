from odoo import fields, models, api


class ResConfigSettings(models.TransientModel):
    """Inherited res configuration setting for adding fields for
                Notch Pay Vendor"""
    _inherit = 'res.config.settings'

    dev_api_key = fields.Char(string="API Key")
    prod_api_key = fields.Char(string="Live API Key")
    dev_secret_key = fields.Char(string="Secret API Key")
    prod_secret_key = fields.Char(string="Secret Live API Key")

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        self.env['ir.config_parameter'].sudo().set_param('website.dev_api_key', self.dev_api_key)
        self.env['ir.config_parameter'].sudo().set_param('website.prod_api_key', self.prod_api_key)
        self.env['ir.config_parameter'].sudo().set_param('website.dev_secret_key', self.dev_secret_key)
        self.env['ir.config_parameter'].sudo().set_param('website.prod_secret_key', self.prod_secret_key)

    def get_values(cls):
        res = super(ResConfigSettings, cls).get_values()
        res.update({
            'dev_api_key': cls.env['ir.config_parameter'].sudo().get_param('website.dev_api_key', default=''),
            'prod_api_key': cls.env['ir.config_parameter'].sudo().get_param('website.prod_api_key', default=''),
            'dev_secret_key': cls.env['ir.config_parameter'].sudo().get_param('website.dev_secret_key', default=''),
            'prod_secret_key': cls.env['ir.config_parameter'].sudo().get_param('website.prod_secret_key', default=''),
        })
        return res
    