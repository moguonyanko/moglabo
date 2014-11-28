;;;dod.lisp
;;;参考:LandOfLisp 15章
;;;

;プレイヤーの総数
(defparameter *num-players* 2)
;マスに積むサイコロの最大数
(defparameter *max-dice* 3)
;ゲーム盤のサイズ
(defparameter *board-size* 2)
;ゲーム盤のマスの数
(defparameter *board-hexnum* (* *board-size* *board-size*))

(defun board-array (lst)
  ;リストで表されたゲーム盤を配列に変える。
  (make-array *board-hexnum* :initial-contents lst))

(defun gen-board ()
  ;ランダムな値を割り振ったゲーム版を生成する。
  (board-array (loop for n below *board-hexnum* 
					 collect (list (random *num-players*)
								   (1+ (random *max-dice*))))))

(defun player-letter (n) 
  ;プレイヤー番号をプレイヤー名に変換する。
  (code-char (+ 97 n)))

(defun draw-board (board)
  ;ゲーム盤を見やすい書式で表示する。
  (loop for y below *board-size* 
		do (progn (fresh-line) 
				  (loop repeat (- *board-size* y)
						do (princ " "))
				  (loop for x below *board-size* 
						for hex = (aref board (+ x (* *board-size* y)))
						do (format t "~a-~a " (player-letter (first hex))
								   (second hex))))))




