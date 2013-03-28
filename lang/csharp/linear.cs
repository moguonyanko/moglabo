/**
 * This is linear algebra library for studying oneself.
 * Reference:
 * 「ゲーム３D数学(O'REILLY)」
 * 「意味がわかる線形代数（ベレ出版）」
 **/
 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Linear
{
	/// <summary>
	/// Vector expression class.
	/// Make as row vector.
	/// </summary>
	public class Vector
	{
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
		
		public Vector(double newx, double newy, double newz)
		{
			x = newx;
			y = newy;
			z = newz;
		}
		
		private double[] Elements;
		
		public double this[int x]
		{
			get
			{
				return Elements[x];
			}
			set
			{
				Elements[x] = value;
			}
		}
		
		public Vector(double[] src)
		{
			Elements = src;
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
	
	/// <summary>
	/// Matrix expression class.
	/// </summary>
	public class Matrix
	{
		private double[,] Elements;
		
		public Matrix(double[,] src)
		{
			Elements = src;
		}
		
		public double[] this[int x]
		{
			get
			{
				int xLen = Elements.GetLength(0);
				double[] row = new double[xLen];
				for (int i = 0; i < xLen; i++) 
				{
					row[i] = Elements[x, i];
				}
				
				return row;
			}
			set
			{
				int xLen = Elements.GetLength(0);
				for (int i = 0; i < xLen; i++) 
				{
					Elements[x, i] = value[i];
				}
			}
		}

		public double this[int x, int y]
		{
			get
			{
				return Elements[x, y];
			}
			set
			{
				Elements[x, y] = value;
			}
		}
		
		private static Matrix OperateMatrix(Matrix m1, Func<int, int, double> operation)
		{
			int xLen = m1.Elements.GetLength(1);
			int yLen = m1.Elements.GetLength(0);
			double[,] newEle = new double[xLen, yLen];
			
			for (int x = 0; x < xLen; x++)
			{
				for (int y = 0; y < yLen; y++)
				{
					newEle[x, y] = operation(x, y);
				}
			}
			
			return new Matrix(newEle);
		}
		
		public static Matrix operator+(Matrix m1, Matrix m2)
		{
			Func<int, int, double> plus = (x, y) => m1[x, y] + m2[x, y];
			
			return OperateMatrix(m1, plus);
		}
		
		public static Matrix operator-(Matrix m1, Matrix m2)
		{
			Func<int, int, double> minus = (x, y) => m1[x, y] - m2[x, y];
			
			return OperateMatrix(m1, minus);
		}
		
		public Matrix transpose()
		{
			Func<int, int, double> trans = (x, y) => this[y, x];
			
			return OperateMatrix(this, trans);
		}
		
		public double[] GetColumn(int targetX)
		{
			List<double> column = new List<double>(Elements.GetLength(0));
			
			for (int x = 0, rowLength = Elements.GetLength(1); x < rowLength; x++)
			{
				double[] row = this[x];
				column.Add(row[targetX]);
			}
			
			return column.ToArray();
		}
		
		private static double[] MulArray(double[] a, double[] b)
		{
			List<double> ret = new List<double>(a.Length);
			
			for (int x = 0; x < a.Length; x++)
			{
				for (int y = 0; y < b.Length; y++)
				{
					ret.Add(a[x] * b[y]);
				}
			}
			
			return ret.ToArray();
		}
		
		private static double CrossSum(Matrix m1, Matrix m2, int m, int n)
		{
			double[] row = m1[m];
			double[] column = m2.GetColumn(n);
			int rowSize = row.Length;
			double[] mulSet = new double[rowSize];
			
			for (int i = 0; i < rowSize; i++)
			{
				mulSet[i] = row[i] * column[i];
			}
			
			// var mulSet = row.Zip(column, (first, second) => first * second);
			return mulSet.Sum();
		}
		
		public static Matrix operator*(Matrix m1, Matrix m2)
		{
			if (m1.Elements.GetLength(1) != m2.Elements.GetLength(0))
			{
				throw new ArgumentException("Invalid matrix size.");
			}
			
			List<double[]> allColumnLst = new List<double[]>();
			for (int i = 0; i < m2.Elements.GetLength(1); i++)
			{
				allColumnLst.Add(m2.GetColumn(i));
			}
			double[][] allColumn = allColumnLst.ToArray();
			
			double[,] newEle = new double[m2.Elements.GetLength(1), m1.Elements.GetLength(0)];
			
			int x = 0;
			for (int j = 0; j < m1.Elements.GetLength(0); j++)
			{
				double[] row = m1[j];
				for (int y = 0; y < allColumn.Length; y++)
				{
					double[] column = allColumn[y];
					List<double> tmp = new List<double>();
					for (int k = 0; k < row.Length; k++)
					{
						tmp.Add(row[k] * column[k]);
					}
					newEle[x++, y] = tmp.Sum();
				}
				x = 0;
			}
			
			return new Matrix(newEle);
		}

		// TODO:Should be used "Predicate".
		// TODO:Only can deal 2 dimension.
		public override bool Equals(object o)
		{
			Matrix m = o as Matrix;
			
			if (this.Elements.GetLength(0) != m.Elements.GetLength(0) || 
			this.Elements.GetLength(1) != m.Elements.GetLength(1))
			{
				return false;
			}
			
			if (m != null)
			{		
				int xLen = Elements.GetLength(1);
				int yLen = Elements.GetLength(0);
			
				for (int x = 0; x < xLen; x++)
				{
					for (int y = 0; y < yLen; y++)
					{
						if (this[x, y] != m[x, y])
						{
							return false;
						}
					}
				}
				
				return true;
			}
			else
			{
				return false;
			}
		}
		
		public override int GetHashCode()
		{
			int hash = 1;
			int xLen = Elements.GetLength(1);
			int yLen = Elements.GetLength(0);
		
			for (int x = 0; x < xLen; x++)
			{
				for (int y = 0; y < yLen; y++)
				{
					hash ^= (int)this[x, y];
				}
			}
			
			return hash;
		}
		
		public override String ToString()
		{
			StringBuilder vals = new StringBuilder();
			
			int xLen = Elements.GetLength(1);
			int yLen = Elements.GetLength(0);
			for (int x = 0; x < xLen; x++)
			{
				for (int y = 0; y < yLen; y++)
				{
					vals.Append(this[x, y]).Append("\t");
				}
				vals.Append("\n");
			}
			
			return vals.ToString();
		}
	}
	
	/// <summary>
	/// Utility tool class.
	/// </summary>
	public class LinearUtil
	{
		public readonly Vector ZeroVector = new Vector(0, 0, 0);
	
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
