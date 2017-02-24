package exercise.math;

public interface TriangleCalculator {
	
	/**
	 * 2辺の間の角をラジアンで表した値を返す。
	 */
	double getRadian();
	
	/**
	 * 2辺のうち底辺を返す。
	 */
	double getBase();
	
	/**
	 * 2辺のうち斜辺を返す。
	 */
	double getOblique();
	
	/**
	 * 2辺とその間の角から三角形の面積を計算する。
	 */
	default double getSize() {
		double base = getBase();
		double oblique = getOblique();
		double size = 0.5 * base * oblique * Math.sin(getRadian());
		return size; 
	}
	
	/**
	 * 2辺とその間の角から三角形の周の長さを計算する。
	 */
	default double getLength(){
		double base = getBase();
		double oblique = getOblique();
		double length = base + oblique + Math.sqrt(Math.pow(base, 2) + 
			Math.pow(oblique, 2) - 2 * base * oblique * Math.cos(getRadian()));
		return length; 
	}
	
	/**
	 * 2辺のうちの1辺を底辺とした時の三角形の高さを計算する。
	 */
	default double getHeight(){
		double oblique = getOblique();
		double height = oblique * Math.sin(getRadian());
		return height; 
	}
	
}
