#!/usr/bin/env perl
use strict;
use warnings;

my $Words = {};
my $deck = undef;
my @decks = ();
while (<>) {
  chomp;
  next if /^\s*(#|$)/;
  my @words = split(/,/, $_);
  if (@words == 1) {
    $deck = $words[0];
    $Words->{$deck} = [];
    push(@decks, $deck);
  } elsif (@words == 2) {
    defined $deck or die "words before deck name: $_";
    push(@{$Words->{$deck}}, @words);
  } else {
    die "bad line: $_";
  }
}

print "const Words = {\n";
for my $deck (@decks) {
  print "  '$deck': [\n";
  my $words = $Words->{$deck};
  for my $i (0 .. $#$words/2) {
    print "    '$words->[2*$i]', '$words->[2*$i+1]',\n";
  }
  print "  ],\n";
}
print <<END;
};
export default Words;
END

__END__
