;;;2012/06/22 moguonyanko
;;;Practice coding CommonLisp to 
;;;train abstraction and study math.

(defun sum (lst)
	(labels ((_sum (_lst acc)
					 (if (null (car _lst))
						 acc
						 (_sum (cdr _lst) (+ (car _lst) acc)))))
		(_sum lst 0)))

(defun mean (lst)
	(/ (sum lst) (length lst)))

(defun heron (a b c)
	(let ((s (/ (+ a b c) 2)))
		(sqrt (+ s (- s a)(- s b)(- s c)))))

(defclass vector ()
	;Vector class
	;elements : Retained numbers.
	(elements))



