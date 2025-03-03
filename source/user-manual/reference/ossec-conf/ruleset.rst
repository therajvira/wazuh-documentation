.. Copyright (C) 2015, Wazuh, Inc.

.. meta::
  :description: Find out more about the configuration options for enabling or disabling rules and decoders with Wazuh.


.. _reference_ossec_rules:

ruleset
=======

.. topic:: XML section name

	.. code-block:: xml

		<ruleset>
		</ruleset>

Configuration options for enabling or disabling rules and decoders.

Options
-------

- `rule_include`_
- `rule_dir`_
- `rule_exclude`_
- `decoder_include`_
- `decoder_dir`_
- `decoder_exclude`_
- `list`_



rule_include
^^^^^^^^^^^^^

Load a single rule file.

+--------------------+-----------------------------------+
| **Default value**  | n/a                               |
+--------------------+-----------------------------------+
| **Allowed values** | Path and filename of rule to load |
+--------------------+-----------------------------------+



rule_dir
^^^^^^^^

Load a directory of rules. The files will be loaded in alphabetical order and any duplicate filenames will be skipped.

+--------------------+------------------------------------+
| **Default value**  | ruleset/rules                      |
+--------------------+------------------------------------+
| **Allowed values** | Path to a directory of rule files. |
+--------------------+------------------------------------+

.. topic:: Attributes

	An optional pattern can be included in the opening tag. The pattern is a regex match string used to determine if a file should be loaded.




rule_exclude
^^^^^^^^^^^^^

Exclude a single rule file.

+--------------------+--------------------------------------+
| **Default value**  | n/a                                  |
+--------------------+--------------------------------------+
| **Allowed values** | Path and filename of rule to exclude |
+--------------------+--------------------------------------+



decoder_include
^^^^^^^^^^^^^^^^^

Load a single decoder file.

+--------------------+--------------------------------------+
| **Default value**  | n/a                                  |
+--------------------+--------------------------------------+
| **Allowed values** | Path and filename of decoder to load |
+--------------------+--------------------------------------+




decoder_dir
^^^^^^^^^^^^^^

Load a directory of decoders. The files will be loaded in alphabetical order and any duplicate filenames will be skipped.

+--------------------+--------------------------------------+
| **Default value**  | ruleset/decoders                     |
+--------------------+--------------------------------------+
| **Allowed values** | Path to a directory of decoder files |
+--------------------+--------------------------------------+

.. topic:: Attributes

  An optional pattern can be included in the opening tag. The pattern is a regex match string used to determine if a file should be loaded.


decoder_exclude
^^^^^^^^^^^^^^^^^

Exclude a single decoder file.

+--------------------+-----------------------------------------+
| **Default value**  | n/a                                     |
+--------------------+-----------------------------------------+
| **Allowed values** | Path and filename of decoder to exclude |
+--------------------+-----------------------------------------+


list
^^^^^^^

Load a single CDB reference for use by other rules.

+--------------------+------------------------------------------------+
| **Default value**  | n/a                                            |
+--------------------+------------------------------------------------+
| **Allowed values** | Path to a list file to be loaded and compiled. |
+--------------------+------------------------------------------------+


.. note::

    Do not include the file extension. Since Wazuh v3.11.0, Wazuh will build and load the CDB lists automatically when the analysis engine starts.

Example of configuration
------------------------

.. code-block:: xml

    <ruleset>
      <rule_include>ruleset/rules/my_rules.xml</rule_include>
      <rule_dir pattern="_rules.xml$">ruleset/rules</rule_dir>
      <rule_exclude>0215-policy_rules.xml</rule_exclude>
      <decoder_include>ruleset/decoders/my_decoder.xml</decoder_include>
      <decoder_dir pattern=".xml$">ruleset/decoders</decoder_dir>
      <decoder_exclude>ruleset/decoders/my_decoder.xml</decoder_exclude>
      <list>etc/lists/blocked_hosts</list>
    </ruleset>
