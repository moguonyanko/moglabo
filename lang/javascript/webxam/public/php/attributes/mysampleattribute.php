<?php 
namespace MySample;

use Attribute;

#[Attribute]
class MySampleAttribtue {
  function __construct(readonly string $name) { }
}
?>
