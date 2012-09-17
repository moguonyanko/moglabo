;2012/09/18 moguonyanko
;Statistics procedure module

(define (sum nums)
	;The sum
	(let rec ((_nums nums) (acc 0))
		(if (null? _nums)
			acc
			(rec (cdr _nums) (+ acc (car _nums))))))

(define (mean nums)
	;The mean value
	(/ (sum nums) (length nums)))

(define (var nums)
	;Variance
	())

