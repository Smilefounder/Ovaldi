using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public interface IPageAnalyzer
    {
        void Analyze(AnalyzeContext context);
    }
}