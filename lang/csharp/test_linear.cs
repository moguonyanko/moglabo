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
	}
}
