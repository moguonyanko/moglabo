;;; 2012/06/22 moguonyanko
;;; Training of function type programing
;;; Reference:
;;;	 ANSI Common Lisp
;;;	  Paul Graham
;;;	 On Lisp
;;;	  Paul Graham
;;;	 Paradigms of Artifical Intelligence Programing:
;;;	 Case Studies in Common Lisp
;;;	  Peter Norvig
;;;	 Introduction to FORTRAN 90, Second Edition
;;;	  Larry Nyhoff, Sanford Leestma
;;;	 Structure and Interpretation of Computer Programs -- 2nd ed
;;;	  Harold Abelson and Gerald Jay Sussman,with Julie Sussman

(defun sum (lst)
	;Calculate sum
	;lst: calculate target list
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

(defun quadeq (a b c)
	)

(defun integral (a b n)
	)

;(defclass vector ()
;	;Vector class
;	;elements : Retained numbers.
;	(elements))

(defun permutate (n)
	;Permutation
	;n: index of permutation
	(labels ((rec (n acc)
		(if (= n 0)
			acc
			(rec (- n 1) (* (acc n))))))
		(rec n 1)))

(defclass matrix ()
	;Matrix class
	(elements))



