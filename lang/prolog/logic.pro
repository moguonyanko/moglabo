/**
 * 2012 moguonyanko 
 * Training of logical programing
 * Reference: 
 * 		Information Science and Technology Center, Kobe University:Naoyuki Tamura
 *		PROLOG PROGRAMMING FOR ARTIFICIAL INTELLIGENCE:I.Bratoko
 **/

/* The distinction of sex predicates. */
male(hyogo).
male(naoyuki).
male(shinji).
male(saburo).
male(yoshihisa).
female(hisako).
female(yoko).
female(nobuko).
female(yoko2).

/* Father and mother predicates. */
father(naoyuki, hyogo).
father(saburo, naoyuki).
father(saburo, shinji).
father(yoshihisa, hisako).
father(hyogo, yoko2).
mother(hisako, hyogo).
mother(yoko, naoyuki).
mother(yoko, shinji).
mother(nobuko, hisako).

/* Parent rules. */
parent(P, C) :- father(P, C).
parent(P, C) :- mother(P, C).
grandfather(GF, C) :- parent(P, C), father(GF, P).
grandmother(GM, C) :- parent(P, C), mother(GM, P).
child(C, P) :- parent(P, C).
grandchild(C, G) :- parent(P, C), parent(G, P).
sibling(X, Y) :- parent(P, X), parent(P, Y), X \== Y.
brother(X, Y) :- sibling(X, Y), male(X).
son(S, P) :- child(S, P), male(S).
uncle(U, C) :- brother(U, P), parent(P, C).

/* Ancestor rules. */
ancestor(A, C) :- parent(A, C).
ancestor(A, C) :- parent(P, C), ancestor(A, P).
descendant(D, P) :- ancestor(P, D).

/* Factorial predicates and rules. */
fact(0, 1).
fact(N, F) :- 
	N > 0,
	N1 is N-1,
	fact(N1, F1),
	F is N*F1.

/* Fibonacci numerical sequence predicates and rules. */
fib(0, 0).
fib(1, 1).
fib(N, F) :-
	N > 1,
	N1 is N-1, fib(N1, F1),
	N2 is N-2, fib(N2, F2),
	F is F1+F2.

/* Collatz problem */
collatz(1).
collatz(N) :-
	N > 1, N mod 2 =:= 0,
	N1 is N//2, 
	write(N1), write(' '),
	collatz(N1).
collatz(N) :-
	N > 1, N mod 2 =:= 1,
	N1 is N*3+1, 
	write(N1), write(' '),
	collatz(N1).
collatz(1, [1]).
collatz(N, [N|L1]) :-
  N > 1, N mod 2 =:= 0, N1 is N//2, collatz(N1, L1).
collatz(N, [N|L1]) :-
  N > 1, N mod 2 =:= 1, N1 is 3*N+1, collatz(N1, L1).

/* Abstract set */
inS(0).
inS(N) :-
	N > 0, (N-1) mod 2 =:= 0,
	N1 is (N-1)//2, inS(N1).
inS(N) :-
	N > 0, (N-1) mod 3 =:= 0,
	N1 is (N-1)//3, inS(N1).

/* Hanoi */
hanoi(0, _, _, _).
hanoi(N, X, Y, Z) :-
	N > 0, N1 is N-1,
	hanoi(N1, X, Z, Y),
	write('move '), write(N),
	write(' from '), write(X),
	write(' to '), write(Y), nl,
	hanoi(N1, Z, Y, X).
	
/* Factorial sum */
factsum(0, 1).
factsum(N, S) :-
	N > 0, 	N1 is N-1,
	factsum(N1, S1),	
	fact(N, F),
	S is F+S1.

/* Greatest common divisor */
gcd(0, B, G) :- G is abs(B).
gcd(A, B, G) :- 
	A =\= 0, R is B mod A,
	gcd(R, A, G).

/* Differential calculus */
d(x, 1).
d(Y, 0) :- atomic(Y), Y \== x.
d(Y+Z, DY+DZ) :- d(Y, DY), d(Z, DZ).
d(Y^N, N*Y^N1*DY) :- integer(N), N1 is N-1, d(Y, DY).
d(Y-Z, DY-DZ) :- d(Y, DY), d(Z, DZ).
d(Y*Z, DY*Z+Y*DZ) :- d(Y, DY), d(Z, DZ).
d(sin(Y), cos(Y)*DY) :- d(Y, DY).
d(cos(Y), -sin(Y)*DY) :- d(Y, DY).

/* Satisfiability problem */
canbe_t(t) :- !.
canbe_t(A /\ B) :- canbe_t(A), canbe_t(B).
canbe_t(A \/ B) :- canbe_t(A); canbe_t(B).
canbe_t(-A) :- canbe_f(A).
canbe_t((A -> B)) :- canbe_f(A); canbe_t(B).

canbe_f(f) :- !.
canbe_f(A /\ B) :- canbe_f(A); canbe_f(B).
canbe_f(A \/ B) :- canbe_f(A), canbe_f(B).
canbe_f(-A) :- canbe_t(A).
canbe_f((A -> B)) :- canbe_t(A), canbe_f(B).

/* List dealing */
first([X|_], X).
second([_,X|_], X).
%nth(1, [X|_], X).
%nth(N, [_|L], X) :- 
%	N > 1, N1 is N-1, nth(N1, L, X).
len([], 0).
len([_|L], N) :-
	len(L, N1), N is N1+1.
%max_list([X], X).
%max_list([X|L], M) :-
%	max_list(L, M1), M is max(X, M1).
rev_range(0, []).
rev_range(N, [N|L1]) :-
	N > 0, N1 is N-1,
	rev_range(N1, L1).
range(I, N, []) :- I > N.
range(I, N, [I|L1]) :-
	I =< N, I1 is I+1,
	range(I1, N, L1).	
inc_list([], []).
inc_list([X|L], [X1|L1]) :-
	X1 is X+1, inc_list(L, L1).
/* Sample rules */
rule(i, '私').
rule(you, 'あなた').
rule(have, '持つ').
rule(love, '愛する').
rule(a, '一つの').
rule(pen, 'ペン').
rule(book, '本').
replace([], []).
replace([X|L], [X1|L1]) :-
	rule(X, X1),
	replace(L, L1).
%append([], Z, Z).
%append([W|X1], Y, [W|Z1]) :-
%	append(X1, Y, Z1).
%last(L, X) :- append(_, [X], L).
memb(X, L) :- append(_, [X|_], L).
%member(X, [X|_]).
%member(X, [_|L]) :- member(X, L).
common([], _, []).
common([X|L], M, [X|L1]) :-
	member(X, M),
	!,
	common(L, M, L1).
common([_|L], M, L1) :-
	common(L, M, L1).
%reverse([], []).
%reverse([X|L], R) :-
%	reverse(L, R1),
%	append(R1, [X], R).
rev(L, R) :- rev(L, [], R).
rev([], R, R).
rev([X|L], Y, R) :- rev(L, [X|Y], R).
palindrome(L) :- reverse(L, L).

/* Permutation */
%permutation([], []).
%permutation(L, [X|L2]) :-
%	del(X, L, L1),
%	permutation(L1, L2).
del(X, [X|L], L).
del(X, [Y|L], [Y|L1]) :-
	del(X, L, L1).
	
/* Slowly sort */
slow_sort(L, L1) :-
	permutation(L, L1),
	orderd(L1).
orderd([]).
orderd([_]).
orderd([X,Y|L]) :-
	X =< Y,
	orderd([Y|L]).
	
/* Quick sort */
qsort([],[]).
qsort([X|L], S) :-
	partition(L, X, L1, L2),
	qsort(L1, S1),
	qsort(L2, S2),
	append(S1, [X|S2], S).
partition([], _, [], []).
partition([Y|L], X, [Y|L1], L2) :-
  Y < X,
  partition(L, X, L1, L2).
partition([Y|L], X, L1, [Y|L2]) :-
  Y >= X,
  partition(L, X, L1, L2).

/* Choice elements */
pos([], []).
pos([X|L1], [X|L2]) :-
	X > 0,
	!,
	pos(L1, L2).
pos([X|L1], L2) :-
	X =< 0,
	pos(L1, L2).

/* Sum list elements */
%sum_list([], 0).
%sum_list([X|L1], S) :-
%	sum_list(L1, S1), S is X+S1.

/* Greater equal list */
ge_list([], _, []).
ge_list([X|L1], N, [X|M]) :-
	X >= N,
	ge_list(L1, N, M).
ge_list([X|L1], N, M) :-
	X < N,
	ge_list(L1, N, M).

/* Route search algorithm */
/* Route predicates.(Expression "arc".) */
/*
            a1 
        v1 ←─→ v2
       	↑  a1r  ↑
        │a4  a2r│a2
        	|        ↓
        v4 ←── v3 ──→ v5
            a3     a5
*/
arc(a1, v1, v2).
arc(a1r, v2, v1).
arc(a2, v2, v3).
arc(a2r, v3, v2).
arc(a3, v3, v4).
arc(a4, v4, v1).
arc(a5, v3, v5).

path(U, U, _, []).
path(U, V, L, [A|P]) :- 
	arc(A, U, U1), 
	\+ member(U1, L),
	path(U1, V, [U1|L], P).

path_find(U, V, P) :- path(U, V, [U], P).

/* Boat puzzle */
/*
最初の状態 ( ○: 宣教師, ●: 人喰い土人, 【＞: ボート )

        左岸   |    川   |   右岸
               |         |
        ○○○ |【＞     |
        ●●● |         |
               |         |
     
目標の状態

        左岸   |    川   |   右岸
               |         |
               |     【＞| ○○○
               |         | ●●●
               |         |
*/
/*
        B : ボートが左岸にあれば 1, 右岸にあれば 0
        M : 左岸にいる ○ の数 (0～3)
        C : 左岸にいる ● の数 (0～3)
*/

move(_, _). /* ○ M人, ● C人を左岸から右岸へ移動 */
back(_, _). /* ○ M人, ● C人を右岸から左岸へ移動 */

mc_arc1(move(1,0), [1,M0,C0], [0,M,C]) :- M is M0-1, C is C0.
mc_arc1(move(0,1), [1,M0,C0], [0,M,C]) :- M is M0,   C is C0-1.
mc_arc1(move(2,0), [1,M0,C0], [0,M,C]) :- M is M0-2, C is C0.
mc_arc1(move(0,2), [1,M0,C0], [0,M,C]) :- M is M0,   C is C0-2.
mc_arc1(move(1,1), [1,M0,C0], [0,M,C]) :- M is M0-1, C is C0-1.

mc_arc1(back(1,0), [0,M0,C0], [1,M,C]) :- M is M0+1, C is C0.
mc_arc1(back(0,1), [0,M0,C0], [1,M,C]) :- M is M0,   C is C0+1.
mc_arc1(back(2,0), [0,M0,C0], [1,M,C]) :- M is M0+2, C is C0.
mc_arc1(back(0,2), [0,M0,C0], [1,M,C]) :- M is M0,   C is C0+2.
mc_arc1(back(1,1), [0,M0,C0], [1,M,C]) :- M is M0+1, C is C0+1.

mc_arc(Move, U, V) :-
	mc_arc1(Move, U, V),
	V = [_,M,C],
	M >= 0, C >= 0,
	not_eaten(M, C),
	M1 is 3-M, C1 is 3-C,
	M1 >= 0, C1 >= 0,
	not_eaten(M1, C1).
	
not_eaten(0, _) :- !.
not_eaten(_, 0) :- !.
not_eaten(M, C) :- M >= C.

mc_puzzle(U, V, P) :- mc_puzzle(U, V, [U], P).

mc_puzzle(U, U, _, []).
mc_puzzle(U, V, L, [A|P]) :-
	mc_arc(A, U, U1),
	\+ member(U1, L),
	mc_puzzle(U1, V, [U1|L], P).

/* Divide number */
part(N, 1, [N]).
part(N, M, [I|L]) :-
	M >= 2,
	I1 is N-M+1,
	for(I, 1, I1),
	N1 is N-I,
	M1 is M-1,
	part(N1, M1, L).

%for(N, N, M) :- N =< M.
%for(I, N, M) :- N =< M, N1 is N+1, for(I, N1, M).

/* Regular expression --- a(a|b)*ab */
delta(q0, a, q1).
delta(q1, a, q1).
delta(q1, a, q2).
delta(q1, b, q1).
delta(q2, b, q3).

ndfa(L) :- ndfa(q0, L, q3).
ndfa(Q, [], Q).
ndfa(Q0, [A|L], Q) :-
	delta(Q0, A, Q1), ndfa(Q1, L, Q). 

/* Syntactic analysis */
/*
Sample text:
	Time flies like an arrow.

Analysis patetrn:
1."Time"を名詞，"flies"を動詞， "like an arrow"を前置詞句とした解釈 「時は矢のように飛ぶ」(光陰矢のごとし)．
2."Time"を形容詞，"flies"を名詞，"like"を動詞とした解釈 「時蝿は矢を好む」．
3."Time"を動詞(命令文)，"flies"を名詞(目的語)， "like an arrow"を前置詞句とした解釈 「矢のように蝿を調整せよ」．
*/
/*
s は文， np は名詞句， vp は動詞句， pp は前置詞句， n は名詞， v は動詞， 
adj は形容詞， det は冠詞， prep は前置詞を表します．
*/
s(s(NP,VP), S0, S) :-
	np(NP, S0, S1), vp(VP, S1, S).
s(s(VP), S0, S) :-
	vp(VP, S0, S).
np(np(N), S0, S) :-
	n(N, S0, S).
np(np(A,N), S0, S) :-
	adj(A, S0, S1), n(N, S1, S).
np(np(D,N), S0, S) :-
	det(D, S0, S1), n(N, S1, S).
vp(vp(V), S0, S) :-
	v(V, S0, S).
vp(vp(V,NP), S0, S) :-
	v(V, S0, S1), np(NP, S1, S).
vp(vp(V,PP), S0, S) :-
	v(V, S0, S1), pp(PP, S1, S).
vp(vp(V,NP,PP), S0, S) :-
	v(V, S0, S1), np(NP, S1, S2), pp(PP, S2, S).
pp(pp(P,NP), S0, S) :-
	prep(P, S0, S1), np(NP, S1, S).
/* Dictionary of sample text. */
n(n(time), [time|S], S).
n(n(flies), [flies|S], S).
n(n(arrow), [arrow|S], S).
v(v(time), [time|S], S).
v(v(flies), [flies|S], S).
v(v(like), [like|S], S).
adj(adj(time), [time|S], S).
prep(prep(like), [like|S], S).
det(det(an), [an|S], S).

/* Natural number */
nat(0).
nat(s(X)) :- nat(X).

even(0).
even(s(X)) :- 	even(X).

odd(s(0)).
odd(s(s(X))) :- odd(X).
%odd(s(X)) :- even(s(s(X))).

plus(0, Y, Y).
plus(s(X), Y, s(Z)) :- plus(X, Y, Z).

le(X, Y) :- plus(X, _, Y).

lt(X, Y) :- le(s(X), Y).

times(0, _, 0).
times(s(X), Y, Z) :- times(X, Y, Z1), plus(Z1, Y, Z).

quot(X, Y, 0, X) :- lt(X, Y).
quot(X, Y, s(Q), R) :- plus(Y, X1, X), quot(X1, Y, Q, R).

prime(s(X)) :- df(X, s(X)).
df(s(0), _).
df(s(s(M)), N) :- dnd(s(s(M)), N), df(s(M), N).
dnd(M, N) :- quot(N, M, _, s(_)).

/* Monkey and Banana */
move(state(middle, onbox, middle, hasnot),
			grasp,
			state(middle, onbox, middle, has)).

move(state(P, onfloor, P, H),
			climb,
			state(P, onbox, P, H)).

move(state(P1, onfloor, P1, H),
			push(P1, P2),
			state(P2, onfloor, P2, H)).
			
move(state(P1, onfloor, B, H),
			walk(P1, P2),
			state(P2, onfloor, B, H)).
			
caught(state(_, _, _, has)).

caught(State1) :-
	move(State1, _, State2),
	caught(State2).

not(P) :-
	P,!,fail;
	true.

/* 8 Queen Problem */			
solution([]).

solution([X/Y | Others]) :-
	solution(Others),
	member(Y, [1,2,3,4,5,6,7,8]),
	not(attacks(X/Y, Others)).

%Queen attack
attacks(X/Y, Others) :-
	member(X1/Y1, Others),
	(Y1 = Y,
	Y1 is Y + X1 - X,
	Y1 is Y - X1 + X).

%member(A, [A | _]).

%member(A, [A | L]) :-
%	member(A, L).

%Solution template
template([1/_,2/_,3/_,4/_,5/_,6/_,7/_,8/_]).

count(_, [], 0).
count(Term, [Head|L], N) :-
	Term == Head, !,
		count(Term, L, N1),
		N is N1 + 1;
	count(Term, L, N).

fib3(N, F) :-
	forwardfib(2, N, 1, 1, F).

	forwardfib(M, N, _, F2, F2) :-
		M >= N.
		
	forwardfib(M, N, F1, F2, F) :-
		M < N,
		NextM is M + 1,
		NextF2 is F1 + F2,
		forwardfib(NextM, N, F2, NextF2, F).

/* Automaton */
final(s3).

%trans(S1, X, S2).
%silent(S1, S2).

trans(s1, a, s1).
trans(s1, a, s2).
trans(s1, b, s1).
trans(s2, b, s3).
trans(s3, b, s4).

silent(s2, s4).
silent(s3, s1).

accepts(S, []) :-
	final(S).

accepts(S, [X | Rest]) :-
	trans(S, X, S1),
	accepts(S1, Rest).

accepts(S, String) :-
	silent(S, S1),
	accepts(S1, String).

/* Family Database */
%person(_, _, _, _).

family(
	person(tom, fox, date(7,may,1950), works(bbc,15200)),
	person(ann, fox, date(9,may,1951), unemployed),
	[person(pat, fox, date(5,may,1973), unemployed),
	person(jim, fox, date(5,may,1973), unemployed)]).
 
husband(X) :-
	family(X, _, _).

wife(X) :-
	family(_, X, _).

child(X) :-
	family(_, _, Children),
	member(X, Children).

exists(Person) :-
	husband(Person);
	wife(Person);
	child(Person).

dateofbirth(person(_, _, Date, _), Date).

salary(person(_, _, _, works(_, S)), S).
salary(person(_, _, _, unemployed), 0).

total([], 0).
total([Person|List], Sum) :-
	salary(Person, S),
	total(List, Rest),
	Sum is S + Rest.

mean([], 0).
mean(List, Mean) :-
	sum_list(List, Sum), 
	length(List, Size),
	Mean is Sum/Size.




