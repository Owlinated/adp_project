using System;
using System.Globalization;

namespace SpaceY.Coffee.MathExpression
{
	public class ConstantEquationTerm : IEquationTerm
	{
		private float Value { get; }

		public ConstantEquationTerm(float value)
		{
			Value = value;
		}
		
		public float Evaluate()
		{
			return Value;
		}

		public string Serialize()
		{
			return Value.ToString(CultureInfo.InvariantCulture);
		}
	}
}
