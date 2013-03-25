using System;
using NUnit.Framework;
using Linear;

namespace TestLinear
{
	[TestFixture]
	public class TestVector
	{
		[Test]
		public void TestNormarize()
		{
			Vector vector = new Vector(12, -5, 0);
			vector.Normalize();
			// Vector answer = new Vector(0.923, -0.385, 0);
			// Assert.AreEqual(answer, vector);
			Assert.AreEqual(0.923, Math.Round(vector.x, 3));
			Assert.AreEqual(-0.385, Math.Round(vector.y, 3));
			Assert.AreEqual(0, vector.z);
		}
		
		[Test]
		public void TestVectorTurnOver()
		{
			Vector v1 = new Vector(1, 1, 1);
			Vector result = -v1;
			Vector expect = new Vector(-1, -1, -1);
			Assert.AreEqual(expect, result);
		}
		
		[Test]
		public void TestVectorPlus()
		{
			Vector v1 = new Vector(1, 2, 3);
			Vector v2 = new Vector(3, 2, 1);
			Vector result = v1 + v2;
			Vector expect = new Vector(4, 4, 4);
			Assert.AreEqual(expect, result);
		}

		[Test]
		public void TestVectorPlusSubstitute()
		{
			Vector v1 = new Vector(1, 2, 3);
			Vector v2 = new Vector(3, 2, 1);
			v1 += v2;
			Vector expect = new Vector(4, 4, 4);
			Assert.AreEqual(expect, v1);
		}
		
		[Test]
		public void TestVectorMinus()
		{
			Vector v1 = new Vector(5, 4, 3);
			Vector v2 = new Vector(3, 2, 1);
			Vector result = v1 - v2;
			Vector expect = new Vector(2, 2, 2);
			Assert.AreEqual(expect, result);
		}
		
		[Test]
		public void TestVectorMinusSubstitute()
		{
			Vector v1 = new Vector(5, 4, 3);
			Vector v2 = new Vector(3, 2, 1);
			v1 -= v2;
			Vector expect = new Vector(2, 2, 2);
			Assert.AreEqual(expect, v1);
		}
		
		[Test]
		public void TestVectorProductByScalar()
		{
			Vector v1 = new Vector(1, 2, 3);
			Vector result = v1 * 3;
			Vector result2 = 3 * v1;
			Vector expect = new Vector(3, 6, 9);
			Assert.AreEqual(expect, result);
			Assert.AreEqual(expect, result2);
		}
		
		[Test]
		public void TestVectorProductSubstitute()
		{
			Vector v1 = new Vector(1, 2, 3);
			v1 *= 3;
			Vector expect = new Vector(3, 6, 9);
			Assert.AreEqual(expect, v1);
		}
		
		[Test]
		public void TestVectorDivByScalar()
		{
			Vector v1 = new Vector(27, 18, 9);
			Vector result = v1 / 3;
			Vector expect = new Vector(9, 6, 3);
			Assert.AreEqual(expect, result);
		}
		
		[Test]
		public void TestVectorDivSubstitute()
		{
			Vector v1 = new Vector(27, 18, 9);
			v1 /= 3;
			Vector expect = new Vector(9, 6, 3);
			Assert.AreEqual(expect, v1);
		}
		
		[Test]
		[ExpectedException(typeof(ArgumentException))]
		public void TestVectorDivByZero()
		{
			Vector v1 = new Vector(27, 18, 9);
			Console.WriteLine(v1 / 0);
		}
		
		[Test]
		public void TestVectorDotProduct()
		{
			Vector v1 = new Vector(1, 2, 3);
			Vector v2 = new Vector(3, 2, 1);
			double result = v1 * v2;
			Assert.AreEqual(10, result);
		}
		
		[Test]
		public void TestVectorMag()
		{
			Vector v1 = new Vector(0, 3, 4);
			double result = LinearUtil.VectorMag(v1);
			Assert.AreEqual(5, result);
		}
		
		[Test]
		public void TestCrossProduct()
		{
			Vector v1 = new Vector(1, 3, 4);
			Vector v2 = new Vector(2, -5, 8);
			Vector result = LinearUtil.CrossProduct(v1, v2);
			Assert.AreEqual(new Vector(44, 0, -11), result);
		}
		
		[Test]
		public void TestDistance()
		{
			Vector v1 = new Vector(5, 0, 0);
			Vector v2 = new Vector(-1, 8, 0);
			double result = LinearUtil.Distance(v1, v2);
			Assert.AreEqual(10, result);
		}
		
		[Test]
		public void TestIndexer()
		{
			double[] src = new double[]{0, 1, 2};
			Vector v1 = new Vector(src);
			Assert.AreEqual(0, v1[0]);
			Assert.AreEqual(1, v1[1]);
			Assert.AreEqual(2, v1[2]);
		}
	}
	
	[TestFixture]
	public class TestMatrix
	{
		[Test]
		public void TestIndexerArg1()
		{
			double[,] elements = new double[,]
			{
				{0, 1},
				{2, 3}
			};
			
			Matrix m = new Matrix(elements);
			Assert.AreEqual(new double[]{0, 1}, m[0]);
			Assert.AreEqual(new double[]{2, 3}, m[1]);
			
			m[0] = new double[]{100, 200};
			Assert.AreEqual(new double[]{100, 200}, m[0]);
		}
		
		[Test]
		public void TestIndexerArg2()
		{
			double[,] elements = new double[,]
			{
				{0, 1},
				{2, 3}
			};
			
			Matrix m = new Matrix(elements);
			Assert.AreEqual(0, m[0, 0]);
			Assert.AreEqual(1, m[0, 1]);
			Assert.AreEqual(2, m[1, 0]);
			Assert.AreEqual(3, m[1, 1]);
			
			m[0, 0] = 10;
			Assert.AreEqual(10, m[0, 0]);
		}
		
		[Test]
		public void TestMatrixPlus()
		{
			double[,] src1 = new double[,]
			{
				{0, 1},
				{2, 3}
			};			
			double[,] src2 = new double[,]
			{
				{4, 3},
				{2, 1}
			};
			
			Matrix m1 = new Matrix(src1);
			Matrix m2 = new Matrix(src2);
			Matrix result = m1 + m2;
			
			double[,] src3 = new double[,]
			{
				{4, 4},
				{4, 4}
			};
			
			Matrix expect = new Matrix(src3);
			
			Assert.AreEqual(expect, result);
		}
	
		[Test]
		public void TestMatrixMinus()
		{
			double[,] src1 = new double[,]
			{
				{4, 3},
				{2, 1}
			};			
			double[,] src2 = new double[,]
			{
				{0, 1},
				{2, 3}
			};
			
			Matrix m1 = new Matrix(src1);
			Matrix m2 = new Matrix(src2);
			Matrix result = m1 - m2;
			
			double[,] src3 = new double[,]
			{
				{4, 2},
				{0, -2}
			};
			
			Matrix expect = new Matrix(src3);
			
			Assert.AreEqual(expect, result);
		}
		
		[Test]
		public void TestMatrixMultiplyDim2x2()
		{
			double[,] src1 = new double[,]
			{
				{1, 3},
				{4, 6}
			};			
			double[,] src2 = new double[,]
			{
				{-1, 3},
				{2, -1}
			};
			
			Matrix m1 = new Matrix(src1);
			Matrix m2 = new Matrix(src2);
			Matrix result = m1 * m2;
			Matrix result2 = m2 * m1;
			
			double[,] src3 = new double[,]
			{
				{5, 0},
				{8, 6}
			};
			
			double[,] src4 = new double[,]
			{
				{11, 15},
				{-2, 0}
			};
			
			Matrix expect = new Matrix(src3);
			Matrix expect2 = new Matrix(src4);
			
			Assert.AreEqual(expect, result);
			Assert.AreEqual(expect2, result2);
		}
		
		[Test]
		public void TestMatrixMultiplyDim2x3()
		{
			double[,] src1 = new double[,]
			{
				{-1, 3, 2},
				{3, -4, -5}
			};
			double[,] src2 = new double[,]
			{
				{1, 3},
				{-2, -2},
				{3, -1}
			};
		
			Matrix m1 = new Matrix(src1);
			Matrix m2 = new Matrix(src2);
			Matrix result1 = m1 * m2;
			
			double[,] src3 = new double[,]
			{
				{-1, -11},
				{-4, 22}
			};
			Matrix expect1 = new Matrix(src3);
			
			Assert.AreEqual(expect1, result1);
		}
		
		[Test]
		public void TestMatrixTranspose()
		{
			double[,] src1 = new double[,]
			{
				{1, 4, -4},
				{5, 3, -3},
				{-2, -1, 2}
			};			
			
			Matrix m1 = new Matrix(src1);
			Matrix result = m1.transpose();
			
			double[,] src2 = new double[,]
			{
				{1, 5, -2},
				{4, 3, -1},
				{-4, -3, 2}
			};
			
			Matrix expect = new Matrix(src2);
			
			Assert.AreEqual(expect, result);
		}
		
		[Test]
		public void TestMatrixGetColumn()
		{
			double[,] src1 = new double[,]
			{
				{1, 4, -4},
				{5, 3, -3},
				{-2, -1, 2}
			};			
			
			Matrix m1 = new Matrix(src1);
			double[] result = m1.GetColumn(1);
			
			double[] expect = new double[]{4, 3, -1};
			
			Assert.AreEqual(expect, result);
		}
	}
}
