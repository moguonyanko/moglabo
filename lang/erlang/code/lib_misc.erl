%Reference:
%	Programing Erlang (Joe Armstrong)

-module(lib_misc).
-export(for/3).

for(Max, Max, F) -> [F(Max)];
for(I, Max, F) -> [F(I)|for(I+1, Max, F)].

sum(L) -> sum(L, 0).

sum([], N) -> N;
sum(H|T, N) -> sum(T, H+N).


