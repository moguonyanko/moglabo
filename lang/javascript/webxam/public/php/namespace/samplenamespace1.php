<?php
namespace samplenamespace1;

function strtoupper($term): string {
  return $term.'!!!!!';
}
const INT_ALL = 100;
class Exception {

  function __construct(readonly string $reason) {
    
  }

  function __toString(): string {
    return $this->reason;
  }

}
?>
