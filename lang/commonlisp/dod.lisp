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

(defun game-tree (board player spare-dice first-move)
  ;ゲーム盤の状態と現在のプレイヤーを保持した木構造を作成する。
  (list player
		board
		(add-passing-move board
						  player
						  spare-dice
						  first-move
						  (attacking-moves board player spare-dice))))

(defun add-passing-move (board player spare-dice first-move moves)
  ;ゲームの木構造に相手に手番を渡す指し手を加える。
  (if first-move
	moves
	(cons (list nil
				(game-tree (add-new-dice board player (1- spare-dice))
						   (mod (1+ player) *num-players*)
						   0
						   t))
		  moves)))

(defun attacking-moves (board cur-player spare-dice)
  ;攻撃可能なマスを探し，攻撃の指し手をゲーム木に加える。
  (labels ((player (pos)
				   (car (aref board pos)))
		   (dice (pos)
				 (cadr (aref board pos))))
	(mapcan (lambda (src)
			  (when (eq (player src) cur-player)
				(mapcan (lambda (dst)
						  (when (and (not (eq (player dst) cur-player))
									 (> (dice src) (dice dst)))
							(list 
							  (list (list src dst)
									(game-tree (board-attack board cur-player
															 src dst (dice src))
											   cur-player
											   (+ spare-dice (dice dst))
											   nil)))))
						(neighbors src))))
			(loop for n below *board-hexnum*
				  collect n))))

(defun neighbors (pos)
  ;隣接するマスを探す。
  (let ((up (- pos *board-size*))
		(down (+ pos *board-size*)))
	(loop for p in (append (list up down)
						   (unless (zerop (mod pos *board-size*))
							 (list (1- up) (1- pos)))
						   (unless (zerop (mod (1+ pos) *board-size*))
							 (list (1+ pos) (1+ down))))
		  when (and (>= p 0) (< p *board-hexnum*))
		  collect p)))







