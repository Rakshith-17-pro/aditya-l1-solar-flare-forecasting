"""Setup script for Aditya-L1 Solar Flare Forecasting Challenge."""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="aditya-l1-flare-forecasting",
    version="0.1.0",
    description="Forecasting and Nowcasting of Solar Flares using SoLEXS & HEL1OS data from Aditya-L1",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Rakshith-17-pro/aditya-l1-solar-flare-forecasting",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Topic :: Scientific/Engineering :: Astronomy",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    python_requires=">=3.10",
    install_requires=requirements,
)
