from .image_lib import get_image_url


def deserialize_product(product):
    # Adding categories
    product_categories = []
    for category in product.public_categ_ids:
        category = {
            'id': category.id,
            'name': category.name,
        }
        product_categories.append(category)

    # Adding images
    product_images = []
    product_main_image = {
        'id': 0,
        'image_url': f"{product.get_base_url()}{get_image_url(product, 'image_1920')}",
        'video_url': ''
    }
    product_images.append(product_main_image)
    for product_image in product.product_template_image_ids:
        p_image = {
            'id': product_image.id,
            'image_url': f"{product.get_base_url()}{get_image_url(product_image, 'image_1920')}",
            'video_url': product_image.video_url
        }
        product_images.append(p_image)

    # Product variants
    variants_list = product.product_variant_ids
    has_variants = True if len(variants_list) > 1 else False

    all_variants_list = []
    if has_variants:
        # get variants attributes and values
        # List the variant from 1 to n as Odoo developers want in the update cart method
        for i, variant in enumerate(variants_list, 1):
            # If we have multiples variants attributes
            variant_attributes = [attrs.name for attrs in variant.product_template_attribute_value_ids],
            variant_attributes = variant_attributes[0]
            variant_attributes = ', '.join(variant_attributes)
            curr_variant = {
                "id": variant.id,
                "list_variant_id": i,
                'product_name': f"{variant.name} [{variant_attributes}]",
                'default_code': variant.default_code,
                'price': variant.lst_price,
            }
            # Update variant pictures
            variant_images_list = []
            # Variant main image
            variant_main_image = {
                'id': 0,
                'image_url': f"{product.get_base_url()}{get_image_url(variant, 'image_1920')}",
                'video_url': ''
            }
            variant_images_list.append(variant_main_image)
            for variant_image in product.product_template_image_ids:
                v_image = {
                    'id': variant_image.id,
                    'image_url': f"{product.get_base_url()}{get_image_url(variant_image, 'image_1920')}",
                    'video_url': variant_image.video_url
                }
                variant_images_list.append(v_image)
            curr_variant['pictures'] = variant_images_list
            all_variants_list.append(curr_variant)

    return {
        'id': product.id,
        'name': product.name,
        'price': product.list_price,
        'description': product.api_product_description,
        'rich_description': product.description,
        'categories': product_categories,
        'image_list': product_images,
        'url': f'{product.get_base_url()}{product.website_url}',
        'additional_information': {
            'weight': product.weight,
            'dimensions': f"{product.dimensions_value} {product.dimensions_unity}",
        },
        'has_variants': has_variants,
        'variants': all_variants_list
    }