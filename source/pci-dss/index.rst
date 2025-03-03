.. Copyright (C) 2015, Wazuh, Inc.

.. meta::
  :description: Wazuh helps organizations meet technical compliance requirements, including PCI DSS. Learn how our capabilities assist with each of PCI standard requirements.

.. _pci_dss:

Using Wazuh for PCI DSS compliance
==================================

The Payment Card Industry Data Security Standard (PCI DSS) is a proprietary information security standard for organizations that handle credit cards. The standard was created to increase controls around cardholder data to reduce credit card fraud.

Wazuh helps ensure PCI DSS compliance by performing log collection, file integrity checking, configuration assessment, intrusion detection, real-time alerting and active response. The Wazuh dashboard displays information in real-time, allowing filtering by different types of alert fields, including compliance controls. We have also developed a couple of PCI DSS dashboards for convenient viewing of relevant alerts. The syntax used for tagging PCI DSS relevant rules is ``pci_dss_`` followed by the number of the requirement (e.g., ``pci_dss_10.2.4 and pci_dss_10.2.5``).

This guide explains how these capabilities and Wazuh modules assist with compliance to the PCI DSS requirements:

* `Wazuh for PCI DSS Guide (PDF) <https://wazuh.com/resources/Wazuh_PCI_DSS_Guide.pdf>`_

In the following sections, we have some use cases that show how to use the Wazuh capabilities and modules to meet PCI DSS requirements.

.. toctree::
    :maxdepth: 1
    :caption: Contents

    log-analysis
    analysis-engine
    configuration-assessment
    malware-detection
    file-integrity-monitoring
    vulnerability-detection
    active-response
    system-inventory
    dashboard

