;2012/09/18 moguonyanko
;Test module for stat

(load "./stat.scm")

(define (assert-equal? a b)
	;Check result at test
	(if (equal? a b)
		(print "OK!")
		(print "fail..."))

(define (base-stat-test)
	;Base statistics procedures test
	(define (test-sum)
		(sum `(1 2 3 4 5))
	)
)

(define (all-run-test)
	(base-stat-test)
)

;(all-run-test)

