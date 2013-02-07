%Reference:
%	Programing Erlang (Joe Armstrong)

-module(shop).
-export([cost/1]).

cost(oranges) -> 5;
cost(newspaper) -> 8;
cost(apples) -> 2;
cost(pears) -> 6;
cost(milk) -> 7.


