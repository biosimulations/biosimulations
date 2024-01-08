import pytest

from simdata_api.main import read_dataset


@pytest.mark.asyncio
async def test_read_dataset():
  dataset = await read_dataset("repressilator_copasi", "/simulation.sedml/report")
  assert dataset.values == [1, 2, 3, 4, 5]


