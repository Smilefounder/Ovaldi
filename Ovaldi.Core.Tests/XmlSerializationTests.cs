using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Runtime.Serialization.Json;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.IO;
using System.Text;
using System.Xml;

namespace Ovaldi.Core.Tests
{

    public class Site_Test
    {
        public string Name { get; set; }
    }

    public class Page_Test
    {
        public virtual Site_Test Site { get; set; }
        public virtual string Name { get; set; }
    }
    [DataContract(Name = "Site", Namespace = "Ovaldi.Core.Tests")]
    internal class SiteDefinition
    {
        [DataMember(Name = "SiteName")]
        public string SiteName { get; set; }
    }

    public class SiteContractSurrogate : IDataContractSurrogate
    {
        public object GetCustomDataToExport(Type clrType, Type dataContractType)
        {
            return null;
        }

        public object GetCustomDataToExport(System.Reflection.MemberInfo memberInfo, Type dataContractType)
        {
            return null;
        }

        public Type GetDataContractType(Type type)
        {
            return type == typeof(Site_Test) ? typeof(SiteDefinition) : type;
        }

        public object GetDeserializedObject(object obj, Type targetType)
        {
            if (obj is SiteDefinition)
            {
                return new Site_Test() { Name = ((SiteDefinition)obj).SiteName };
            }
            return obj;
        }

        public void GetKnownCustomDataTypes(System.Collections.ObjectModel.Collection<Type> customDataTypes)
        {

        }

        public object GetObjectToSerialize(object obj, Type targetType)
        {
            if (obj is Site_Test)
            {
                return new SiteDefinition() { SiteName = ((Site_Test)obj).Name };
            }
            return obj;
        }

        public Type GetReferencedTypeOnImport(string typeName, string typeNamespace, object customData)
        {
            return null;
        }

        public System.CodeDom.CodeTypeDeclaration ProcessImportedType(System.CodeDom.CodeTypeDeclaration typeDeclaration, System.CodeDom.CodeCompileUnit compileUnit)
        {
            return null;
        }
    }

    [TestClass]
    public class XmlSerializationTests
    {
        [TestMethod]
        public void TestMethod1()
        {
            var knowTypes = new List<Type> { };
            var serializer = new DataContractSerializer(typeof(Page_Test), knowTypes, int.MaxValue, false, false, new SiteContractSurrogate());//, new ContractResolver());// new DataContractSerializer(typeof(Page));//

            var page = new Page_Test() { Site = new Site_Test() { Name = "Site1" }, Name = "Page1" };
            using (var stream = new MemoryStream())
            {
                serializer.WriteObject(stream, page);
                stream.Position = 0;

                Console.WriteLine(Encoding.UTF8.GetString(stream.ToArray()));

                // The deserialized object
                object newMyClass = serializer.ReadObject(stream);


                Console.WriteLine(newMyClass);
            }
        }
    }
}
