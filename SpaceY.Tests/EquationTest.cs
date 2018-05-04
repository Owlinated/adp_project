using SpaceY.Core;
using Xunit;

namespace SpaceY.Tests
{
    /// <summary>
    /// Test cases for equations.
    /// </summary>
    public class EquationTest
    {
        /// <summary>
        /// Test that 1+1 = 2
        /// </summary>
        [Fact]
        public void Test1()
        {
            var e1 = new Equation("1+1", "1 + 1");
            Assert.Equal(expected: 2, actual: e1.Evaluate());
        }

        /// <summary>
        /// Test that negative numbers
        /// </summary>
        [Fact]
        public void Test2()
        {
            var e2 = new Equation("-1+1", "-1 + 1");
            Assert.Equal(expected: 0, actual: e2.Evaluate());
        }
    }
}
