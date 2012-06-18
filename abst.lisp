;;;2012 moguonyanko
;;;Practice coding CommonLisp and Mathematics.

(defun sum (lst)
	(labels ((_sum (_lst acc)
					 (if (null (car _lst))
						 acc
						 (_sum (cdr _lst) (+ (car _lst) acc)))))
		(_sum lst 0)))

(defun mean (lst)
	(/ (sum lst) (length lst)))
