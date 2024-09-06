from django.test import TestCase
from myproxy.utils import connect_to_odoo

class AuthOdooTestCase(TestCase):
    def setUp(self) -> None:
        self.driverId = 1
        self.constructorId = 131
        self.circuitId = 3
        self.race_round = 1
        self.year = 2023

    