;;;Statistics procedure module

(define (sum nums)
	;Sum of numbers
	(let rec ((_nums nums) (acc 0))
		(if (null? _nums)
			acc
			(rec (cdr _nums) (+ acc (car _nums))))))

(define (mean nums)
	;The mean value by numbers
	(/ (sum nums) (length nums)))

(define (square x)
  ;Square number
  (* x x))

(define (reduce proc targets)
  ;Reduce target objects.
  ())

(define (var nums)
	;Variance of numbers
	())



