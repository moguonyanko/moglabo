/**
 * This is linear algebra library to study mine.
 * Reference:
 * 「ゲーム３D数学(O'REILLY)」
 **/
 
using System;

namespace Linear
{
	public class Vector
	{
		public Vector(double newx, double newy, double newz)
		{
			x = newx;
			y = newy;
			z = newz;
		}
		
		public double x
		{
			get;
			set;
		}
		
		public double y
		{
			get;
			set;
		}
		
		public double z
		{
			get;
			set;
		}
		
		public void Zero()
		{
			x = y = z = 0.0;
		}
		
		public void Normalize()
		{
			double magSq = x*x + y*y + z*z;
			
			if (magSq > 0.0)
			{
				double oneOverMag = 1.0 / Math.Sqrt(magSq);
				
				x *= oneOverMag;
				y *= oneOverMag;
				z *= oneOverMag;
			}
		}
		
		public override string ToString()
		{
			return "(x, y, z) = " + x + ", " + y + ", " + z;
		}
	}
}
