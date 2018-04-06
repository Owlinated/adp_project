using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SpaceY.Coffee;
using SpaceY.DataAccess;

namespace SpaceY.Controllers
{
	[Route("api/[controller]")]
	public class EquationsController : Controller
	{
		private EquationsStore equationsStore { get; } = new EquationsStore();

		//[HttpGet("[action]")]
		[HttpGet]
		public IEnumerable<RestEquation> Get()
		{
			return equationsStore.Equations.Select(equation => new RestEquation{Equation = equation.Serialize()});
		}

		[HttpGet("[action]")]
		public float Evaluate(string equation)
		{
			return new Equation(equation).Evaluate();
		}

		public class RestEquation
		{
			public string Equation { get; set; }
		}
	}
}