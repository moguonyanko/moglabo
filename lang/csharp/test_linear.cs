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
			Assert.AreEqual(0.923, Math.Round(vector.x, 3));
			Assert.AreEqual(-0.385, Math.Round(vector.y, 3));
			Assert.AreEqual(0, vector.z);
		}
	}
}
