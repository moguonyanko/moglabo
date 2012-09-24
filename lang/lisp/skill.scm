;;;2012/03/19 moguonyanko
;;;This program to implove my programing skill.
;;;Reference:
;;;Structure and Interpretation of Computer Programs (2nd Edition)
;;;		Hal Abelson, Jerry Sussman, Julie Sussman
;;;The programing language Scheme
;;;		Kent Dybvig
;;;M.Hiroi's Home Page
;;;		M.Hiroi

;;Linear congruential generators
(define *seed* 1)

(define srand (lambda (x) 
	(set! *seed* x)))

(define irand (lambda () 
	(set! *seed* (modulo (+ (* 69069 *seed*) 1) #x100000000))
	*seed*))

(define random (lambda () 
	(* (/ 1.0 #x100000000) (irand))))

;;Lower 16 bit omit
(define make-number (lambda (n) 
	(modulo (quotient (irand) #x10000) n)))

(define make-random-list (lambda (size maximum)  
	(define randls (lambda (ls s)
		(if (= s 0) 
			ls
			(randls (append ls (list (make-number maximum))) (- s 1)))))
	(randls (list) size)))
	
(define single? (lambda (ls)
	(and (pair? ls) (null? (cdr ls)))))

(define double? (lambda (ls)
	(and (pair? ls) (single? (cdr ls)))))

(define longer? (lambda (xs ys)
	(and (pair? xs)
		(or (null? ys) (longer? (cdr xs) (cdr ys))))))

(define last (lambda (ls)
	(car (reverse ls))))

(define butlast (lambda (ls)
	(reverse (cdr (reverse ls)))))

(define take (lambda (ls n)
	(if (or (= n 0) (null? ls))
		(list)
		(cons (car ls) (take (cdr ls) (- n 1))))))

(define drop (lambda (ls n)
	(if (or (= n 0) (null? ls))
		ls
		(drop (cdr ls) (- n 1)))))

(define (size items) 
    (if (null? items)
	0
	(+ 1 (size (cdr items)))))

(define (binaly-search items target)
    (let ((left 0) (right (- (size items) 1)))
    	(define (search l r)
			(print "left " l " : right " r " : target " target ) 
			(let ((middle (floor (/ (+ l r) 2))))
				(print "middle " middle)
				(cond ((< target (list-ref items middle)) (search l middle))
	    			((< (list-ref items middle) target) (search middle r))
	    			(else middle))))
		(search left right)))

(define subseq (lambda (ls x y)
	(take (drop ls x) (- y x))))

(define butlastn (lambda (ls n)
	(reverse (drop (reverse ls) n))))

(define group (lambda (ls n)
	(if (or (= n 0) (null? ls))
		ls
		(cons (take ls n) (group (drop ls n) n)))))

(define position0 (lambda (x ls)
	(let ((len (length ls)))
		(define rec (lambda (xx lst p)
			(if (eqv? xx (car lst))
				p
				(if (null? (cdr lst))
					#f
					(rec xx (cdr lst) (+ p 1))))))
		(rec x ls 0))))

(define position (lambda (x ls)
	(let rec ((_ls ls) (p 0))
		(cond ((eqv? x (car _ls)) p)
			((null? (cdr _ls)) #f)
			(else
				(rec (cdr _ls) (+ p 1)))))))

;;(define count (lambda (x ls)
;;	(cond ((eqv? x ls) 1)
;;	((not (list? ls)) 0)
;;		(else (+ (count x (car ls)) (count x (cdr ls)))))))

(define count (lambda (x ls)
	(let rec ((_ls ls) (c 0))
		(cond ((null? _ls) c)
			((eqv? x (car _ls)) (rec (cdr _ls) (+ c 1)))
			(else (rec (cdr _ls) c))))))

(define sum-list (lambda (ls)
	(let rec ((_ls ls) (acc 0))
		(if (null? _ls) 
			acc
			(rec (cdr _ls) (+ acc (car _ls)))))))

(define max-list (lambda (ls)
	(last (sort ls))))

(define min-list (lambda (ls)
	(car (sort ls))))

(define adjacent? (lambda (x y ls)
	(let ((posx (position x ls)))
		(if posx 
			(let ((lhs (+ posx 1)))
				(if (= lhs (length ls)) #f
					(eqv? (car (drop ls (+ posx 1))) y)))
			#f))))

(define make-matrix (lambda (rows columns)
	(do ((m (make-vector rows))
		(i 0 (+ i 1)))
		((= i rows) m)
		(vector-set! m i (make-vector columns)))))

(define matrix? (lambda (x)
	(and (vector? x) 
		(> (vector-length x) 0)
		(vector? (vector-ref x 0)))))

(define matrix-ref (lambda (m i j)
	(vector-ref (vector-ref m i) j)))

(define matrix-set! (lambda (m i j x)
	(vector-set! (vector-ref m i) j x)))

(define mul (lambda (x y)
	(define type-error (lambda (what)
		(error "Not a number or matrix" what)))
	(define match-error (lambda (what1 what2)
		(error "Incompatible operands" what1 what2)))
	(define matrix-rows (lambda (x)
		(vector-length x)))
	(define matrix-columns (lambda (y)
		(vector-length (vector-ref x 0))))
	(define mat-sca-mul (lambda (m x)
		(let* ((nr (matrix-rows m))
			(nc (matrix-columns m))
			(r (make-matrix nr nc)))
			(do ((i 0 (+ i 1)))
				((= i nr) r)
				(do ((j 0 (+ j 1)))
					((= j nc))
					(matrix-set! r i j 
						(* x (matrix-ref m i j))))))))
	(define mat-mat-mul (lambda (m1 m2)
		(let* ((nr1 (matrix-rows m1))
			(nr2 (matrix-rows m2))
			(nc2 (matrix-columns m2))
			(r (make-matrix nr1 nc2)))
			(if (not (= (matrix-columns m1) nr2))
				(match-error m1 m2))
			(do ((i 0 (+ i 1)))
				((= i nr1) r)
				(do ((j 0 (+ j 1)))
					((= j nc2))
					(do ((k 0 (+ k 1))
						(a 0 (+ a (* (matrix-ref m1 i k)
							(matrix-ref m2 k j)))))
						((= k nr2)
							(matrix-set! r i j a))))))))
	(cond 
		((number? x)
		(cond 
			((number? y) (* x y))
			((matrix? y) (mat-sca-mul x y))
			(else (type-error y))))
		((matrix? x)
		(cond 
			((number? y) (mat-sca-mul x y))
			((matrix? y) (mat-mat-mul x y))
			(else (type-error y))))
		(else (type-error x)))))

(define merge-sort #f)

(define merge #f)

(let ()
	(define dosort (lambda (pred? ls n)
		(cond 
			((= n 1) (list (car ls)))
			((= n 2) (let ((x (car ls)) (y (cdr ls)))
				(if (pred? y x) (list y x) (list x y))))
			(else 
				(let ((i (quotient n 2)))
					(domerge pred?
						(dosort pred? ls i)
						(dosort pred? (list-tail ls i) (- n i))))))))
	(define domerge (lambda (pred? l1 l2)
		(cond 
			((null? l1) l2)
			((null? l2) l1)
			((pred? (car l2) (car l1))
				(cons (car l2) (domerge pred? l1 (cdr l2))))
			(else (cons (car l1) (domerge pred? (cdr l1) l2))))))
	(set! merge-sort
		(lambda (pred? l)
			(if (null? l) l
				(dosort pred? l (length l)))))
	(set! merge
		(lambda (pred? l1 l2)
			(domerge pred? l1 l2))))
								
(define (before? x y ls)
	(let ((xs (memv x ls)))
		(if xs 
			(memv y (cdr xs))
			#f)))

(define (iota n m)
	(if (> n m)
		'()
		(cons n (iota (+ n 1) m))))
			
(define (set-of-list src)
	(let rec ((dist `()) (tmp src))
		(cond 
			((null? tmp) (reverse! dist))
			((memv (car tmp) (cdr tmp))
				(rec dist (cdr tmp)))
			(else
				(rec (cons (car tmp) dist) (cdr tmp))))))

(define (union s1 s2)
	(set-of-list (append s1 s2)))

(define (intersection s1 s2)
	(let rec ((dist `()) (c1 s1))
		(cond 
			((null? c1)
				(reverse! dist))
			((memv (car c1) s2)
				(rec (cons (car c1) dist) (cdr c1)))
			(else
				(rec dist (cdr c1))))))

(define (deference xs ys)
	(define inner (lambda (ls1 ls2)
		(let rec ((dist `()) (c1 ls1))
			(cond 
				((null? c1)
					(reverse! dist))
				((not (memv (car c1) ls2))
					(rec (cons (car c1) dist) (cdr c1)))
				(else
					(rec dist (cdr c1)))))))
	(append (inner xs ys) (inner ys xs)))

(define (merge-list pred l1 l2)
	;Should be sort l1, l2 by pred.
	(let rec ((dist `()) (_l1 l1) (_l2 l2))
		(cond
			((null? _l1)
				(append! (reverse! dist) _l2))
			((null? _l2)
				(append! (reverse! dist) _l1))
			(else 
				(let ((x (car _l1)) (y (car _l2)))
					(if (pred x y)
						(rec (cons x dist) (cdr _l1) _l2)
						(rec (cons y dist) _l1 (cdr _l2))))))))

(define-syntax half
	(syntax-rules ()
		((_ ls) 
			(let ((hflen (/ (length ls) 2)))
				(values
					(reverse (list-tail (reverse ls) hflen))
					(list-tail ls hflen)))))) 

(define (merge-sort pred size ls)
	(if (= size 1)
		(list (car ls))
		(let ((midium (quotient size 2)))
			(merge-list pred 
				(merge-sort pred midium ls)
				(merge-sort pred midium (list-tail ls midium))))))

(define (prefix? l1 l2)
	(cond 
		((null? l2) #t)
		((null? l1) #f)
		(else 
			(if (eqv? (car l1) (car l2))
				(prefix? (cdr l1) (cdr l2))
				#f))))

(define (_suffix? l1 l2)
	(let ((len1 (length l1)) (len2 (length l2)))
		(if (< len1 len2)
			#f
			(let ((restl1 (drop l1 (- len1 len2))))
				(equal? restl1 l2)))))

(define (suffix? l1 l2)
	(prefix (reverse l1) (reverse l2)))

(define (sublist xs ls)
	(cond
		((null? ls) #f)
		((prefix? ls xs) #t)
		(else
			(sublist xs (cdr ls)))))
		
(define (member-tree x ls)
	(define (iter ls cont)
		(cond 
			((pair? ls) 
				(iter (car ls) cont)
				(iter (cdr ls) cont))
			((eqv? x ls) 
				(cont #t))
			(else #f)))
	(call/cc 
		(lambda (cont) (iter ls cont))))

(define-syntax find
	(syntax-rules ()
		((_ target lst)
			(let rec ((tgt target) (ls lst) (idx 0))
				(cond 
					((null? ls) 
						(values #f idx))
					((eqv? tgt (car ls))
						(values #t idx))
					(else
						(rec tgt (cdr ls) (+ idx 1))))))))

(define (count-leaf tree)
	(cond 
		((pair? tree)
			(+ (count-leaf (car tree))
				(count-leaf (cdr tree))))
		((null? tree) 0)
		(else 1)))

;;This function is not complete.
(define-syntax traverse
	(syntax-rules ()
		((_ tree fn)
			(cond 
				((pair? tree)
					(traverse (car tree) fn)
					(traverse (cdr tree) fn))
				((not (null? tree))
					(fn tree))
				(else tree)))))
 
;;Not work.
(define (subst x y ls)
	(cond
		((pair? ls)
			(cons (subst x y (car ls))
				(subst x y (cdr ls)))
		((eqv? x ls) y)
		(else ls))))

(define (cntsize ls)
	(let rec ((_ls ls) (cnt 0))
		(if (null? _ls)
			cnt
			(rec (cdr _ls) (+ cnt 1))))) 

(define (sum nums)
	(let rec ((_nums nums) (acc 0))
		(if (null? _nums)
			acc
			(rec (cdr _nums) (+ acc (car _nums))))))

(define (mean nums)
	(/ (sum nums) (length nums)))

(define (make-rat n d)
	(let ((g (gcd n d)))
		(cons (/ n g) (/ d g))))

(define (numer x)
	(car x))
	
(define (denom x)
	(cdr x))

(define (print-rat x)
	(newline)
	(display (numer x))
	(display "/")
	(display (denom x)))

(define (add-rat x y)
	(make-rat (+ (* (numer x) (denom y))
									(* (numer y) (denom x)))
								(* (denom x) (denom y))))

(define (sub-rat x y)
	(make-rat (- (* (numer x) (denom y))
									(* (numer y) (denom x)))
								(* (denom x) (denom y))))

(define (mul-rat x y)
	(make-rat (* (numer x) (numer y))
								(* (denom x) (denom y))))

(define (div-rat x y)
	(make-rat (* (numer x) (denom y))
								(* (denom x) (numer y))))

(define (equal-rat? x y)
	(= (* (numer x) (denom y))
		(* (numer y) (denom x))))

(define (scale-list items factor)
	(map (lambda (x) (* x factor))
		items))

(define (count-leaves x)
	(cond ((null? x) 0)
				((not (pair? x)) 1)
				(else (+ (count-leaves (car x))
					(count-leaves (cdr x))))))

(define (scale-tree tree factor)
	(map (lambda (sub-tree)
			(if (pair? sub-tree) 
					(scale-tree sub-tree factor)
					(* sub-tree factor)))
				tree))

(define (filter predicate sequence)
	(cond ((null? sequence) nil)
			((predicate (car sequence))
					(cons (car sequence) 
							(filter predicate (cdr sequence))))
				(else (filter predicate (cdr sequence)))))

(define (accumulate op initial sequence)
	(if (null? sequence)
			initial
			(op (car sequence)
					(accumulate op initial (cdr sequence)))))

(define nil (list))

(define (enumerate-interval low high)
	(if (> low high)
		nil
		(cons low (enumerate-interval (+ low 1) high))))

(define (enumerate-tree tree)
	(cond ((null? tree) nil)
			((not (pair? tree)) (list tree))
			(else (append (enumerate-tree (car tree))
												(enumerate-tree (cdr tree))))))

(define (square x)
	(* x x))

(define (sum-odd-squares tree)
	(accumulate +
								0
								(map square 
										(filter odd?
												(enumerate-tree tree)))))

(define (fib n)
	(define (fib-iter a b count)
		(if (= count 0)
			b
			(fib-iter (+ a b) a (- count 1))))
	(fib-iter 1 0 n))

(define (even-fibs n)
	(accumulate cons
								nil	
								(filter even?
													(map fib
																(enumerate-interval 0 n)))))

(define (flatmap proc seq)
	(accumulate append nil (map proc seq)))

(define (permutations s)
	(if (null? s)
				(list nil)
				(flatmap (lambda (x)
											(map (lambda (p) (cons x p)
													(permutations (remove x s)))))
											s)))

(define (remove item sequence)
	(filter (lambda (x) (not (= x item)))
			sequence))

(define (deriv exp var)
	(cond ((number? exp) 0)
					((variable? exp)
							(if (same-variable? exp var) 1 0))
					((sum? exp)
							(make-sum (deriv (addend exp) var)
													(deriv (augend exp) var)))
					((product? exp)
							(make-sum 
									(make-product (multiplier exp)
																		(deriv (multiplicand exp) var))
									(make-product (deriv (multiplier exp) var)
																		(multiplicand exp))))
					(else
							(error "unknown expression type -- DERIV" exp))))

(define (variable? x) (symbol? x))

(define (same-variable? v1 v2)
	(and (variable? v1) (variable? v2) (eq? v1 v2)))
		
(define (=number? exp num)
	(and (number? exp) (= exp num)))

(define (make-sum a1 a2) 
	(cond ((=number? a1 0) a2)
					((=number? a2 0) a1)
					((and (number? a1) (number? a2)) (+ a1 a2))
					(else (list '+ a1 a2))))

(define (make-product m1 m2) 
	(cond ((or (=number? m1 0) (=number? m2 0)) 0)
					((=number? m1 1) m2)
					((=number? m2 1) m1)
					((and (number? m1) (number? m2)) (* m1 m2))
					(else (list '* m1 m2))))

(define (sum? x)
	(and (pair? x) (eq? (car x) '+)))
		
(define (addend s) (cadr s))

(define (augend s) (caddr s))

(define (product? x)
	(and (pair? x) (eq? (car x) '*)))
		
(define (multiplier p) (cadr p))

(define (multiplicand p) (caddr p))

(define (addsin a b)
	;Addtion theorem of sin.
	(+ (* (sin a) (cos b)) (* (cos b) (sin a))))

(define (addcos a b)
	;Addtion theorem of cos.
	(- (* (cos a) (cos b)) (* (sin b) (sin a))))

(define (addtan a b)
	;Addtion theorem of tangent.
	(let ((nume (+ (tan a) (tan b))))
		(/ nume (- 1 (* (tan a) (tan b))))))
		
;(define (simpson fn x0 x1 num)
;	;Simpson rule. TODO:implement now.
;	(let ((h 0.0) (sum 0.0) (x 0.0) (i 0))
;		(set! h (- x1 x0))
;		(if (> num 0) 
;			)))

(define (pow a n)
	;Repeat power.
	(let rec ((_a a) (_n n) (answer 1))
		(if (= _n 0)
			answer
			(if (odd? _n)
				(rec (* _a _a) (quotient _n 2) (* answer _a))
				(rec (* _a _a) (quotient _n 2) answer)))))
				
(define (indeq a b)
	;Solve indeterminate equation by extended Euclid's algorithm.
	;TODO: Not work.
	(let rec ((x1 0) (y1 0) (z1 a) (x2 0) (y2 0) (z2 b))
		(if (<= z2 1)
			(list x2 y2)
			(let ((r (/ (- z1 (remainder z1 z2)) z2)))
				(set! x1 (- x1 (* r x2)))
				(set! y1 (- y1 (* r y2)))
				(set! z1 (- z1 (* r z2)))
				(rec x2 y2 z2 x1 y1 z1)))))

(define (zip ls1 ls2)
	;Combine two lists vertically.
	;TODO: Syntax error.
;	(let rec ((_l1 l1) (_l2 l2) (res `())
;		(if (or (null? _l1) (null? _l2))
;			res
;			(let ((a (car _l1)) (b (car _l2))
;				(rec (cdr _l1) (cdr _l2) (list res (cons a b))))))))
)




	
	
