#!/usr/bin/perl

use strict;
use warnings;
use utf8;

=pod
2012/09/18 My Practiccal Perl Program
=cut

#String test
print "Hello, world\n";
print "GOMA"."USAO\n";

#Number test
my $num1 = 100;
print $num1;
print "\n";
my $num2 = 200;
print $num1+$num2;
print "\n";

my ($num3, $dumy);

$num3 = 1000;
$dumy = $num3 + 2000;
$num3 = $dumy;
print $num3;
print "\n";

my $count = 0;
until($count > 2){
	print $count;
	print "\n";
	$count++;
}

my ($var1, $var2, $var3) = (100, 5, 2);
print $var1/$var2/$var3;
print "\n";
($var1, $var2, $var3) = ($var3, $var2, $var1);
print $var1/$var2/$var3;
print "\n";

my @vars;
@vars[0] = "usao";
@vars[1] = "monchi";
@vars[2] = "kitezou";
print @vars;
print "\n";


