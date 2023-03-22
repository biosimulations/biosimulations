import pytest
from typed_dotenv import load as typed_dotenv_load


@pytest.fixture(autouse=True)
def load_test_env():
    typed_dotenv_load("env/secret.env")
    typed_dotenv_load("env/config.env")
    typed_dotenv_load("env/shared.env")
