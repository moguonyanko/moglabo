#!/usr/bin/escript

main([A]) ->
	I = list_to_integer(A),
	F = fac(I),
	io:format("fractorial ~w = ~w~n", [I, F]).

fac(0) -> 1;
fac(N) -> 
	N * fac(N-1).


