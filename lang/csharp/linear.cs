/**
 * This is linear algebra library to study mine.
 * Reference:
 * 「ゲーム３D数学(O'REILLY)」
 **/
 
using System;

namespace Linear
{
	/*
	 * <summary>
	 * Vector expression class.
	 * </summary>
	 */
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
		
		public override bool Equals(object o)
		{
			Vector v = o as Vector;
			
			if (v != null)
			{		
				return x == v.x && y == v.y && z == v.z;
			}
			else
			{
				return false;
			}
		}
		
		public override int GetHashCode()
		{
			return (int)x^(int)y^(int)z;
		}
		
		public void Zero()
		{
			x = y = z = 0.0;
		}
		
		public static Vector operator-(Vector v1)
		{
			return new Vector(-v1.x, -v1.y, -v1.z);
		}
		
		public static Vector operator+(Vector v1, Vector v2)
		{
			return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
		}

		public static Vector operator-(Vector v1, Vector v2)
		{
			return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
		}
		
		private static Vector Product(Vector v1, double scalar)
		{
			return new Vector(v1.x * scalar, v1.y * scalar, v1.z * scalar);
		}
		
		public static Vector operator*(Vector v1, double scalar)
		{
			return Product(v1, scalar);
		}

		public static Vector operator*(double scalar, Vector v1)
		{
			return Product(v1, scalar);
		}
		
		public static Vector operator/(Vector v1, double scalar)
		{
			if (scalar == 0)
			{
				throw new ArgumentException("Zero division cannot accept.");
			}
			
			double oneOverScalar = 1.0 / scalar;
			
			return new Vector(v1.x * oneOverScalar, v1.y * oneOverScalar, v1.z * oneOverScalar);
		}
		
		public static double operator*(Vector v1, Vector v2)
		{
			return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
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
	
	/*
	 * <summary>
	 * Utility tool class.
	 * </summary>
	 */
	public class LinearUtil
	{
		// public const Vector ZeroVector = new Vector(0, 0, 0);
		
		public static double VectorMag(Vector v)
		{
			return Math.Sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
		}
		
		public static Vector CrossProduct(Vector v1, Vector v2)
		{
			return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, 	v1.x * v2.y - v1.y * v2.x);
		}
		
		public static double Distance(Vector v1, Vector v2)
		{
			double deltaX = v1.x - v2.x;
			double deltaY = v1.y - v2.y;
			double deltaZ = v1.z - v2.z;
			return Math.Sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
		}
	}
}
