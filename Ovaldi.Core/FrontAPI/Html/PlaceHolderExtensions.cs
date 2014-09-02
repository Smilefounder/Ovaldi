#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using Ovaldi.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Ovaldi.Core.FrontAPI
{
    public static class PlaceHolderExtensions
    {
        #region PlaceHolder
        public static IHtmlString PlaceHolder(this IFrontHtmlHelper frontHtmlHelper, string id, Func<string> defaultContentFunc)
        {
            if (frontHtmlHelper.Page_Context.PageRequestContext.SiteMappedContext.RequestChannel == FrontRequestChannel.Design)
            {
                //render designer code
                return new HtmlString("todo: render the desinger code");
            }
            else
            {
                var positions = GetContents(frontHtmlHelper.Page_Context.PageRequestContext.Page, id);
                if (positions.Length == 0)
                {
                    defaultContentFunc = defaultContentFunc == null ? () => "" : defaultContentFunc;
                    return new HtmlString(defaultContentFunc());
                }
                else
                {
                    var htmlStrings = RenderPositionContents(frontHtmlHelper, positions).ToArray();
                    return new AggregateHtmlString(htmlStrings);
                }

            }
        }
        #endregion

        #region IsEmptyHolder
        public static bool IsEmptyHolder(this IFrontHtmlHelper frontHtmlHelper, string id)
        {
            if (frontHtmlHelper.Page_Context.PageRequestContext.SiteMappedContext.RequestChannel == FrontRequestChannel.Design)
            {
                return false;
            }
            else
            {
                return GetPageContents(frontHtmlHelper, id).Length == 0;
            }
        }
        private static IPageContent[] GetPageContents(IFrontHtmlHelper frontHtmlHelper, string id)
        {
            var pageContents = (frontHtmlHelper.Page_Context.PageRequestContext.Page.PageContents ?? new IPageContent[0]).Where(it => it.PlaceHolderId.Equals(id, StringComparison.InvariantCultureIgnoreCase)).ToArray();
            return pageContents;
        }
        #endregion

        #region Private methods
        private static IPageContent[] GetContents(Page page, string id)
        {
            var positions = (page.PageContents ?? new IPageContent[0])
                .Where(it => it.PlaceHolderId.Equals(id, StringComparison.InvariantCultureIgnoreCase))
                .ToArray();
            return positions;
        }
        private static IEnumerable<IHtmlString> RenderPositionContents(IFrontHtmlHelper htmlHelper, IEnumerable<IPageContent> pageContents)
        {
            return pageContents.Select(it => RenderPageContent(htmlHelper, it)).Where(it => it != null);
        }
        private static IHtmlString RenderPageContent(IFrontHtmlHelper htmlHelper, IPageContent pageContent)
        {
            var renderer = ResolvePageContentRenderer(pageContent);

            if (renderer != null)
            {
                return renderer.Render(htmlHelper, pageContent);
            }
            return null;
        }
        private static PageContentRenderer<IPageContent> ResolvePageContentRenderer(IPageContent pageContent)
        {
            Type genericType = typeof(PageContentRenderer<>);
            Type genericTypeParameter = pageContent.GetType();
            var pageContentRender = (PageContentRenderer<IPageContent>)Kooboo.Common.ObjectContainer.EngineContext.Current.ResolveGeneric(genericType, genericTypeParameter);

            return pageContentRender;
        }
        #endregion
    }
}
