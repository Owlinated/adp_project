using Xunit;
using SpaceY.Core;

namespace SpaceY.Tests
{
	/// <summary>
	/// Test cases for equations.
	/// </summary>
	public class EquationTest
	{
        [Fact]
        public void Test1 () {
            Equation e1 = new Equation(0, "1 + 1");
            Assert.Equal(2, e1.Evaluate());
        }

        [Fact]
        public void Test2 () {
            Equation e2 = new Equation(1, "-1 + 1");
            Assert.Equal(0, e2.Evaluate());
        }
	}
}
