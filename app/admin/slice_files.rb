ActiveAdmin.register SliceFile do
  menu parent: 'Slices'
  controller do
    def permitted_params
      params.permit!
    end
  end
end
